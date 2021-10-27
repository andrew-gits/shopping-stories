import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useState } from 'react';
import ItemEntriesTable from './ItemEntriesTable';
import RegularEntryTable from './RegularEntryTable';
import TobaccoEntryTable from './TobaccoEntryTable';

const ParsingResultTableRow = (props: { row: any; index: number }) => {
	const { row, index } = props;
	const [open, setOpen] = useState(false);

	const columnValues: any[] = [
		row?.accountHolder?.accountFirstName,
		row?.accountHolder?.accountLastName,
		row?.accountHolder?.prefix,
		row?.accountHolder?.suffix,
		row?.accountHolder?.debitOrCredit,
		row?.accountHolder?.location,
		row?.accountHolder?.profession,
		row?.accountHolder?.reference,
		row?.accountHolder?.accountHolderID,
		row?.dateInfo?.day,
		row?.dateInfo?.month,
		row?.dateInfo?.year,
		row?.dateInfo?.fullDate,
		row?.meta?.entryID,
		row?.meta?.ledger,
		row?.meta?.reel,
		row?.meta?.folioPage,
		row?.meta?.owner,
		row?.meta?.store,
		row?.meta?.year,
		row?.money?.colony,
		row?.money?.quantity,
		row?.money?.commodity,
		row?.money?.currency.pounds,
		row?.money?.currency.shilling,
		row?.money?.currency.pence,
		row?.money?.sterling.pounds,
		row?.money?.sterling.shilling,
		row?.money?.sterling.pence,
	];

	// row.people.map((person: { name: string; id: null | string }) => {
	// 	person.name;
	// 	person.id;
	// });
	// row.places.map((place: { name: string; id: null | string }) => {
	// 	place.name;
	// 	place.id;
	// });
	// row?.tobaccoEntry.entry;
	// row?.tobaccoEntry.tobaccoShaved;
	// row?.tobaccoEntry.mark.map((mark: { markID: string; markString: string }) => {
	// 	mark.markID;
	// 	mark.markString;
	// });
	// row?.tobaccoEntry.money.map(
	// 	(money: {
	// 		moneyType: string;
	// 		tobaccoMark: number;
	// 		caskInTransaction: number;
	// 	}) => {
	// 		money.moneyType;
	// 		money.tobaccoMark;
	// 		money.caskInTransaction;
	// 	},
	// );
	// row?.tobaccoEntry.notes.map(
	// 	(note: { noteNum: number; totalWeight: number; barrelWeight: number }) => {
	// 		note.noteNum;
	// 		note.totalWeight;
	// 		note.barrelWeight;
	// 	},
	// );

	// row?.regularEntry.map(
	// 	(entry: {
	// 		entry: string;
	// 		tobaccoMark: { markName: string; markID: string }[];
	// 		itemsMentioned: { item: string; quantity: number; qualifier: string }[];
	// 	}) => {
	// 		entry.entry;
	// 		entry.tobaccoMark.map((mark) => {
	// 			mark.markName;
	// 			mark.markID;
	// 		});
	// 		entry.itemsMentioned.map((item) => {
	// 			item.item;
	// 			item.quantity;
	// 			item.qualifier;
	// 		});
	// 	},
	// );
	console.log(row.itemEntry);

	return (
		<>
			<TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
				<TableCell>
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={() => setOpen(!open)}
					>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell component="td" scope="row">
					{index}
				</TableCell>
				{columnValues.map((value, i: number) => (
					<TableCell key={i} align="right">
						{value}
					</TableCell>
				))}
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						{row.itemEntry && <ItemEntriesTable itemEntries={row.itemEntry} />}
						{row.regularEntry && (
							<RegularEntryTable regularEntry={row.regularEntry} />
						)}
						{row.tobaccoEntry && (
							<TobaccoEntryTable tobaccoEntry={row.tobaccoEntry} />
						)}
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
};

export default ParsingResultTableRow;
