import { buildSchema } from "graphql";
import { EventModel } from "../schema/event";

export const schema=buildSchema(`
    type event{
        id:ID!
        date:String!
        name:String!
        images:[String!]!
        desc:String!
    }
    
    type Query{
        event(id:ID!):Event
        events:[Event!]!
    }

    input EventInput{
        date:String!
        name:String!
        images:[String!]!
        desc:String!
    }

    type Mutation{
        createEvent(input:EventInput!):EventModel!
        updateEvent(input:EventInput!):EventModel
        deleteEvent(id:ID!):eventModel!
    }
`);

export interface EventInput{
    date:Date;
    name:string;
    images:string[];
    desc:string;
}

export const root={
    event:async({id}:{id:string})=>{
        const data=await EventModel.findById(id).lean();
        return data;
    },
    events:async()=>{
        const data=await EventModel.find().lean();
        return data;
    },
    createEvent:async ({input}:{input:EventInput})=>{
        const Event=new EventModel(input);
        const saved=await Event.save();
        return saved;
    },
    updateEvent:async ({id,input}:{id:String,input:EventInput})=>{
        return EventModel.findByIdAndUpdate(id,input,{new:true}).lean();
    },
    deleteEvent:async({id}:{id:string})=>{
        const deletedEvent=await EventModel.findByIdAndDelete(id).lean();
        return deletedEvent;
    }
}