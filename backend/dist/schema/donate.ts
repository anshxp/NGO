import mongoose,{Schema,Types,Document,Model} from "mongoose";

export interface IDonate extends Document{
    donator:string;
    contact:number;
    address:string;
    transactionId:string;
    timestamp:Date;
    amount:number;
    payment_method:string;
    payment_status:"SUCCESS" | "FAILED" | "PENDING";
    donation_type:string;
    isAnonymous:boolean;
    created_at:Date;
    updated_at:Date;
}

const donateSchema:Schema<IDonate>=new Schema<IDonate>(
    {
        donator:{
            type:String,
            required:true
        },
        contact:{
            type:Number,
            required:true
        },
        address:{
            type:String
        },
        transactionId:{
            type:String,
            required:true
        },
        amount:{
            type:Number,
            required:true
            
        },
        payment_method:{
            type:String,
            required:true
        },
        timestamp:{
            type:Date,
            default:Date.now()
        },
        donation_type:{
            type:String,
            required:true
        },
        payment_status:{
            type:String,
            enum:['SUCCESS','FAILED','PENDING'],
            default:'PENDING'
        },
        isAnonymous:{
            type:Boolean,
            default:false
        }
    },
    {
        timestamps:{
            createdAt:'created_at',
            updatedAt:'updated_at'
        }
    }
)

export const DonateModel:Model<IDonate>=mongoose.model<IDonate>("Donate",donateSchema);