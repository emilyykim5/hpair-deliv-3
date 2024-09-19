import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { getCategory } from '../utils/categories';
import EntryModal from './EntryModal';

// Table component that displays entries on home screen

export default function BasicTable({ entries }) {
   const [sortedEntries, setSortedEntries] = useState(entries);
   const [order, setOrder] = useState('asc');

   // Update sortedEntries whenever entries prop changes
   useEffect(() => {
      setSortedEntries(entries);
   }, [entries]);

   const handleSortByCategory = () => {
      const isAsc = order === 'asc';
      const sorted = [...sortedEntries].sort((a, b) => {
         const categoryA = getCategory(a.category).name.toLowerCase();
         const categoryB = getCategory(b.category).name.toLowerCase();
         return isAsc ? categoryA.localeCompare(categoryB) : categoryB.localeCompare(categoryA);
      });
      setSortedEntries(sorted);
      setOrder(isAsc ? 'desc' : 'asc');
   };

   return (
      <TableContainer component={Paper}>
         <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
               <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Email</TableCell>
                  <TableCell align="right">User</TableCell>
                  <TableCell align="right" onClick={handleSortByCategory} style={{ cursor: 'pointer' }}>
                     Category {order === 'asc' ? '▲' : '▼'}
                  </TableCell>
                  <TableCell align="right">Date Created</TableCell>
                  <TableCell align="right">Open</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {sortedEntries.map((entry) => {
                  const date = entry.dateCreated ? new Date(entry.dateCreated) : new Date();
                  const isValidDate = !isNaN(date);

                  return (
                     <TableRow
                        key={entry.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                     >
                        <TableCell component="th" scope="row">
                           {entry.name}
                        </TableCell>
                        <TableCell align="right"><a href={`mailto:${entry.email}`}>{entry.email}</a></TableCell>
                        <TableCell align="right">{entry.user}</TableCell>
                        <TableCell align="right">{getCategory(entry.category).name}</TableCell>
                        <TableCell align="right">
                           {isValidDate ? date.toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell sx={{ "padding-top": 0, "padding-bottom": 0 }} align="right">
                           <EntryModal entry={entry} type="edit" />
                        </TableCell>
                     </TableRow>
                  );
               })}
            </TableBody>
         </Table>
      </TableContainer>
   );
}
