import { ProjectModel } from '../../schema/project';
import { ExpenseModel } from '../../schema/expense';
import { BeneficiaryModel } from '../../schema/beneficiary';

export const projectResolvers = {
    Query: {
        getProjects: async (args: any, context: any) => {
            return await ProjectModel.find()
                .populate('organizer')
                .populate('donors')
                .sort({ startDate: -1 });
        },
        getProjectById: async (args: any, context: any) => {
            return await ProjectModel.findById(args.id)
                .populate('organizer')
                .populate('donors')
                .populate('beneficiaries');
        },
        getProjectReports: async (args: any, context: any) => {
            const project = await ProjectModel.findById(args.projectId);
            return project?.reports || [];
        }
    },
    Mutation: {
        createProject: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }

            try {
                const projectId = `PROJ-${Date.now()}`;
                const project = new ProjectModel({
                    projectId,
                    title: args.title,
                    description: args.description,
                    objective: args.objective,
                    totalBudget: args.totalBudget,
                    startDate: new Date(),
                    endDate: args.endDate,
                    imageUrl: args.imageUrl,
                    organizer: context.userId,
                    status: 'planning'
                });

                const savedProject = await project.save();
                return { ...savedProject.toObject(), success: true };
            } catch (error) {
                throw new Error(`Project creation failed: ${error.message}`);
            }
        },

        addBeneficiaryToProject: async (args: any, context: any) => {
            try {
                const project = await ProjectModel.findById(args.projectId);
                if (!project) throw new Error('Project not found');

                if (!project.beneficiaries.includes(args.beneficiaryId)) {
                    project.beneficiaries.push(args.beneficiaryId);
                }

                const savedProject = await project.save();
                return { ...savedProject.toObject(), success: true };
            } catch (error) {
                throw new Error(`Failed to add beneficiary: ${error.message}`);
            }
        },

        recordExpense: async (args: any, context: any) => {
            if (!context.user) throw new Error('Authentication required');

            try {
                const expenseId = `EXP-${Date.now()}`;
                const expense = new ExpenseModel({
                    expenseId,
                    amount: args.amount,
                    category: args.category,
                    description: args.description,
                    projectId: args.projectId,
                    status: 'pending'
                });

                const savedExpense = await expense.save();

                // Update project expenses
                const project = await ProjectModel.findById(args.projectId);
                if (project) {
                    project.expenses = (project.expenses || 0) + args.amount;
                    await project.save();
                }

                return { ...savedExpense.toObject(), success: true };
            } catch (error) {
                throw new Error(`Failed to record expense: ${error.message}`);
            }
        },

        approveExpense: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }

            const expense = await ExpenseModel.findByIdAndUpdate(
                args.expenseId,
                { status: 'approved', approvedBy: context.userId },
                { new: true }
            );

            return { ...expense?.toObject(), success: true };
        }
    }
};

export const beneficiaryResolvers = {
    Query: {
        getBeneficiaries: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            return await BeneficiaryModel.find()
                .populate('projects')
                .sort({ created_at: -1 });
        },
        getBeneficiaryById: async (args: any, context: any) => {
            return await BeneficiaryModel.findById(args.id)
                .populate('projects');
        },
        searchBeneficiaries: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }
            return await BeneficiaryModel.find({
                $or: [
                    { name: { $regex: args.query, $options: 'i' } },
                    { beneficiaryId: { $regex: args.query, $options: 'i' } },
                    { category: { $regex: args.query, $options: 'i' } }
                ]
            });
        }
    },
    Mutation: {
        addBeneficiary: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }

            try {
                const beneficiaryId = `BEN-${Date.now()}`;
                const beneficiary = new BeneficiaryModel({
                    beneficiaryId,
                    name: args.name,
                    email: args.email,
                    phone: args.phone,
                    address: args.address,
                    age: args.age,
                    gender: args.gender,
                    category: args.category,
                    status: 'active'
                });

                const savedBeneficiary = await beneficiary.save();
                return { ...savedBeneficiary.toObject(), success: true };
            } catch (error) {
                throw new Error(`Failed to add beneficiary: ${error.message}`);
            }
        },

        updateBeneficiary: async (args: any, context: any) => {
            if (!context.user || context.user.role !== 'admin') {
                throw new Error('Unauthorized');
            }

            const beneficiary = await BeneficiaryModel.findByIdAndUpdate(
                args.id,
                {
                    name: args.name,
                    email: args.email,
                    phone: args.phone,
                    address: args.address,
                    status: args.status
                },
                { new: true }
            );

            return { ...beneficiary?.toObject(), success: true };
        },

        addHelpHistory: async (args: any, context: any) => {
            try {
                const beneficiary = await BeneficiaryModel.findById(args.beneficiaryId);
                if (!beneficiary) throw new Error('Beneficiary not found');

                beneficiary.helpHistory.push({
                    projectId: args.projectId,
                    helpType: args.helpType,
                    description: args.description,
                    date: new Date()
                });

                await beneficiary.save();
                return { ...beneficiary.toObject(), success: true };
            } catch (error) {
                throw new Error(`Failed to add help history: ${error.message}`);
            }
        }
    }
};
