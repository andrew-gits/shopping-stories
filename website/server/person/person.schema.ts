import {
    getModelForClass,
    index,
    modelOptions,
    prop,
} from '@typegoose/typegoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Field, ID, ObjectType } from 'type-graphql';

export type PersonDocument = Person & Document;

@ObjectType({ description: 'People Object' })
@modelOptions({
    schemaOptions: {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
})
@index(
    { firstName: 'text', lastName: 'text', prefix: 'text', suffix: 'text' },
    // @ts-ignore
    { name: 'search_index' },
)
export class Person {
    @Field((_returns) => ID, { description: 'String of MongoDB ObjectId' })
    public get id(): string {
        return `${this._id}`; // Converts type ObjectId of _id to String
    }

    public set id(_) {}

    readonly _id?: ObjectId;

    @prop({ required: true })
    @Field({ nullable: true, description: 'Variations of given item' })
    account: string;

    @prop({ default: '' })
    @Field({ nullable: true, description: 'Variations of given item' })
    enslaved: string;

    @prop({ required: true })
    @Field({ nullable: true, description: 'Variations of given item' })
    firstName: string;

    @prop({ required: true })
    @Field({ nullable: true, description: 'Variations of given item' })
    lastName: string;

    @prop({ default: '' })
    @Field({ nullable: true, description: 'Variations of given item' })
    gender: string;

    @prop({ default: '' })
    @Field({ nullable: true, description: 'Variations of given item' })
    location: string;

    @prop({ default: '' })
    @Field({ nullable: true, description: 'Variations of given item' })
    prefix: string;

    @prop({ default: '' })
    @Field({ nullable: true, description: 'Variations of given item' })
    profession: string;

    @prop({ default: '' })
    @Field({ nullable: true, description: 'Variations of given item' })
    professionCategory: string;

    @prop({ default: '' })
    @Field({ nullable: true })
    professionQualifier: string;

    @prop({ default: '' })
    @Field({ nullable: true, description: 'Variations of given item' })
    reference: string;

    @prop({ default: '' })
    @Field({ nullable: true, description: 'Variations of given item' })
    store: string;

    @prop({ default: '' })
    @Field({ nullable: true, description: 'Variations of given item' })
    suffix: string;

    @prop({ default: '' })
    @Field({ nullable: true, description: 'Variations of given item' })
    variations: string;
}

export const PersonModel = mongoose.models.Person || getModelForClass(Person);
