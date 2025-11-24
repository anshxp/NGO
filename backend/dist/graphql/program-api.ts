import { buildSchema } from "graphql";
import { ProgramModel } from "../schema/program";
import mongoose,{ Types } from "mongoose";

export const program_Schema=buildSchema(`

    type User{
        id: ID!
        firstname: String!
        lastname: String!
        contact: Int!
        email: String!
        role: String!
    }

    type ProgramModel{
        id:ID!
        name:String!
        desc:String!
        date:Date!
        volunteer_name:User!
        contact: Int!
        created_At: Date!
        updated_At: Date!
    }

    input ProgramInput {
        name: String!
        desc: String!
        date: Date!
        volunteer_name: String!
        contact: Int!
    }

    type Query {
        programs: [Program!]!
        program(id: ID!): Program
    }
        
    type Mutation {
        createProgram(input: ProgramInput!): Program!
        updateProgram(input:ProgramInput!):Program!
        deleteProgram(input:id):Program!
    }

`)

export interface ProgramInput{
    name:string;
    desc:string;
    date:Date;
    volunteer_name:mongoose.Types.ObjectId;
    contact:number;
    created_At:Date;
    updated_At:Date;
};

export const Program={

    program:async ({id}:{id:string})=>{
        const data=await ProgramModel.findById(id).lean();
        return data;
    },

    programs:async ()=>{
        const data=await ProgramModel.find().lean();
        return data;
    },

    createProgram:async ({input}:{input:ProgramInput})=>{
        const Program=new ProgramModel(input);
        const saved=await Program.save();
        return saved;
    },

    updateProgram:async ({id,input}:{id:string,input:ProgramInput})=>{
        return await ProgramModel.findByIdAndUpdate(id,input,{new:true}).lean();
    },

    deleteProgram: async ({id}:{id:string})=>{
        const res=await ProgramModel.findByIdAndDelete(id);
        return  !!res;
    }

};