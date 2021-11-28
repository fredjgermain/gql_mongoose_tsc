// Dependancies 
import 'dotenv/config'; 
import { ApolloServer } from "apollo-server-express"; 
import express from "express"; 
import "reflect-metadata"; 
import { buildSchema, NonEmptyArray } from "type-graphql"; 
import { connect } from "mongoose";  

import cors from "cors"; 


