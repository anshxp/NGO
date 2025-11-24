import { buildSchema } from 'graphql';
import {UserModel} from '../schema/user';

export const user_Schema=buildSchema(`

    enum Role{
        admin
        volunteer
    }

    type UserModel{
        id:ID!
        firstname: String!
        lastname: String!
        contact:Number!
        email: String!
        password: String!
        role: Role!
    }
    
    type Query{
        user(id: ID!): User
    }
    
    input UserInput{
        firstname: String!
        lastname: String!
        contact:Number!
        email: String!
        password: String!
        role: Role!
    }
    
    type Mutation{
        createUser(input:UserInput!):UserModel!
        deleteUser(id:ID!):UserModel!
    }
`);

export interface UserInput {
    firstname: string;
    lastname: string;
    contact:Number;
    email: string;
    password: string;
    role: 'admin' | 'volunteer';
};

export const User={
    user:async({id}:{id:string})=>{
        const data=await UserModel.findById(id).lean();
        return data;
    },
    createUser:async ({input}:{input:UserInput})=>{
        const User=new UserModel(input);
        const saved=await User.save();
        return saved;
    },
    deleteUser: async ({ id }: { id: string }) => {
        const res = await UserModel.findByIdAndDelete(id);
        return !!res;
    },
};