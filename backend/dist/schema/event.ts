import mongoose,{Model,Schema,model,Document} from 'mongoose';

export interface Event extends Document{
    date:Date;
    name:string;
    images:string[];
    desc:string;
}

const eventSchema:Schema<Event>=new Schema <Event>(
    {
        date:{
            type:Date,
            required:true
        },
        name:{
            type:String,
            required:true
        },
        images:{
            type:[String],
            required:true
        },
        desc:{
            type:String,
            required:true
        }
    },
    {
        timestamps:true,
    }
)

export const EventModel:Model<Event>=mongoose.model<Event>('Event',eventSchema);