import mongoose,{Schema,Document,Model,Types} from "mongoose";

export interface IProgram extends Document{
    name:string;
    desc:string;
    date:Date;
    volunteer_name:mongoose.Types.ObjectId;
    contact:number;
    created_At:Date;
    updated_At:Date;
}
const program_Schema:Schema<IProgram>=new Schema<IProgram>(
    {
        name:{
            type:String,
            required:true
        },
        desc:{
            type:String,
            required:true
        },
        date:{
            type:Date,
            required:true
        },
        volunteer_name:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        contact:{
            type:Number,
            required:true
        },
        created_At:{
            type:Date,
            default:Date.now
        },
        updated_At:{
            type:Date,
            default:Date.now
        }
    },
    {
        timestamps:true
    }
);

export const ProgramModel : Model<IProgram> =mongoose.model<IProgram>("Program",program_Schema);