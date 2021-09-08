import { createUnionType, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type EntryDocument = Entry & Document;
@ObjectType('MoneyObject')
export class MoneyObject {
	@Field({ description: 'Number of pounds' })
	L: number;

	@Field({ description: 'Number of shillings' })
	S: number;

	@Field({ description: 'Number of Pence' })
	D: number;
}

@ObjectType('ItemEntry')
export class ItemEntry {
	@Field({ description: 'Quantity of item' })
	ItemQuantity: number;

	@Field({ description: 'Item descriptors' })
	Qualifier: string;

	@Field({ description: 'Item name' })
	Item: string;

	@Field({ description: 'Price per unit' })
	UnitPrice: string;

	@Field({ description: '' })
	TransactionCost: string;

	@Field((type) => MoneyObject, { description: 'Money used in transaction' })
	Money: MoneyObject;
}

@ObjectType('NoteObject')
export class NoteObject {
	@Field({ description: '' })
	NoteNum: number;

	@Field({ description: '' })
	TotalWeight: number;

	@Field({ description: '' })
	BarrelWeight: number;

	@Field({ description: '' })
	TobaccoWeight: number;
}

@ObjectType('TobaccoRateObject')
export class TobaccoRateObject {
	@Field({ description: '' })
	MoneyType: string;

	@Field({ description: '' })
	TobaccoAmount: number;

	@Field(type => MoneyObject, { description: '' })
	RateForTobacco: MoneyObject;

	@Field({ description: '' })
	CaskInTransaction: number;

	@Field({ description: '' })
	CasksSoldFor: MoneyObject;
}

@ObjectType('TobaccoEntryObject')
export class TobaccoEntryObject {
	@Field({ description: 'words' })
	Entry: string;

	@Field({
		description: 'Signifies which person is represented in the exchange',
	})
	Mark: string;

	@Field((type) => [NoteObject], { description: '' })
	Notes: NoteObject[];

	@Field(type => [TobaccoRateObject], { description: '' })
	Money: TobaccoRateObject[];
}


// export const entryUnion = createUnionType({
// 	name: 'entryUnion',
// 	types: () => [ItemEntry, TobaccoEntryObject],
// 	resolveType(value) {
// 		if (typeof value.Money !== undefined) {
// 			return ItemEntry;
// 		}
// 		return TobaccoEntryObject;
// 	},
// });

@ObjectType('DateObject', { description: 'Single Date' })
export class DateObject {
	@Field((type) => Int, { description: 'day of date' })
	day: number;

	@Field((type) => Int, { description: 'month of date' })
	month: number;

	@Field((type) => Int, { description: 'year of date' })
	year: number;

	@Field((type) => Date, { description: 'complete date' })
	date: Date;
}

@Schema()
@ObjectType('Entry', { description: 'Single Entry' })
export class Entry {
	@Field((type) => ID, { description: 'String of MongoDB ObjectId' })
	public get id(): string {
		return `${this._id}`; // Converts type ObjectId of _id to String
	}

	_id: ObjectId;

	@Prop({ required: true })
	@Field((type) => Int, { description: 'Reel of the Entry' })
	Reel: number;

	@Prop({ required: true })
	@Field((type) => String, { description: 'Store Owner' })
	Owner: string;

	@Prop({ required: true })
	@Field((type) => String, { description: 'Name of Store' })
	Store: string;

	@Prop({ required: true })
	@Field((type) => [Int], { description: 'Year the entry was made' })
	Year: [number];

	@Prop({ required: true })
	@Field((type) => Int, { description: 'Folio the entry is contained in' })
	FolioPage: number;

	@Prop({ required: true })
	@Field((type) => String, { description: 'ID of entry within Folio' })
	EntryID: string;

	@Prop({ required: true })
	@Field((type) => String, { description: "Prefix of account holder's name" })
	Prefix: string;

	@Prop({ required: true })
	@Field((type) => String, { description: 'First name of account holder' })
	AccountFirstName: string;

	@Prop({ required: true })
	@Field((type) => String, { description: 'Last name of account holder' })
	AccountLastName: string;

	@Prop({ required: true })
	@Field((type) => String, { description: 'Suffix of account holder' })
	Suffix: string;

	@Prop({ required: true })
	@Field((type) => String, { description: 'Profession of account holder' })
	Profession: string;

	@Prop({ required: true })
	@Field((type) => String, { description: 'Location?' })
	Location: string;

	@Prop({ required: true })
	@Field((type) => String, { description: 'Reference?' })
	Reference: string;

	@Prop({ required: true })
	@Field((type) => String, { description: 'Debt or Credit transaction' })
	DrCr: string;

	@Prop({ required: true })
	@Field((type) => DateObject, { description: 'Date of entry' })
	Date: DateObject;

	@Prop({ name: "ItemEntry", type: Object, default: null })
	@Field((type) => [ItemEntry], {nullable: true})
	ItemEntry?: ItemEntry[] | null;

	@Prop({ name: 'TobaccoEntry', type: Object, default: null})
	@Field((type) => TobaccoEntryObject, {nullable: true})
	TobaccoEntry?: TobaccoEntryObject | null;

	@Prop({ required: true })
	@Field((type) => [String], { description: 'People referenced in this entry' })
	People: [string];

	@Prop({ required: true })
	@Field((type) => [String], { description: 'Places referenced in this entry' })
	Places: [string];

	@Prop({ required: true })
	@Field((type) => Int, { description: 'Reference to another Folio page' })
	FolioReference: number;

	@Prop({ required: true })
	@Field((type) => Int, { description: 'Type of Entry' })
	EntryType: number;

	@Prop({ required: true })
	@Field((type) => String, { description: 'Ledger containing this Entry' })
	Ledger: string;

	@Prop({ required: true })
	@Field((type) => Int, { description: 'Quantity of commodity purchased' })
	Quantity: number;

	@Prop({ required: true })
	@Field((type) => String, { description: 'Commodity being purchased' })
	Commodity: string;

	@Prop({ required: true })
	@Field((type) => Int, { description: 'Sterling pounds used in transaction' })
	L1: number;

	@Prop({ required: true })
	@Field((type) => Int, {
		description: 'Sterling shillings used in transaction',
	})
	S1: number;

	@Prop({ required: true })
	@Field((type) => Int, { description: 'Sterling pence used in transaction' })
	D1: number;

	@Prop({ required: true })
	@Field((type) => String, { description: 'Type of Colonial currency' })
	Colony: string;

	@Prop({ required: true })
	@Field((type) => Int, { description: 'Colonial pounds used in transaction' })
	L2: number;

	@Prop({ required: true })
	@Field((type) => Int, {
		description: 'Colonial shillings used in transaction',
	})
	S2: number;

	@Prop({ required: true })
	@Field((type) => Int, { description: 'Colonial pence used in transaction' })
	D2: number;

	@Prop({ required: true })
	@Field((type) => Int, {
		description: 'Indicates if item would survive till today',
	})
	ArchMat: number;

	@Prop({ required: true })
	@Field((type) => Int, {
		description: 'Indicates if someone or someplace is mentioned in the entry',
	})
	GenMat: number;

	@Prop({ required: true })
	@Field((type) => String, { description: 'comments on the entry' })
	Final: string;
}

export const EntrySchema = SchemaFactory.createForClass(Entry);