import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { useState } from 'react';
import { categories } from '../utils/categories'; // Your predefined categories
import { addEntry, deleteEntry, updateEntry } from '../utils/mutations';

// Modal component for BOTH adding and editing entries
export default function EntryModal({ entry = {}, type = 'add', user }) {
   const [open, setOpen] = useState(false);
   const [name, setName] = useState(entry.name || "");
   const [email, setEmail] = useState(entry.email || "");
   const [description, setDescription] = useState(entry.description || "");
   const [category, setCategory] = useState(entry.category || "");
   const [customCategory, setCustomCategory] = useState(""); // For custom category
   const [isCustomCategory, setIsCustomCategory] = useState(false); // To track custom category

   const handleClickOpen = () => {
      setOpen(true);
   };

   const handleClose = () => {
      setOpen(false);
   };

   const handleCategoryChange = (event) => {
      const value = event.target.value;
      if (value === 'custom') {
         setIsCustomCategory(true);
         setCategory(customCategory);
      } else {
         setIsCustomCategory(false);
         setCategory(value);
      }
   };

   const handleCustomCategoryChange = (event) => {
      setCustomCategory(event.target.value);
      setCategory(event.target.value);
   };

   const handleAdd = () => {
      const newEntry = {
         name: name,
         email: email,
         description: description,
         user: user?.displayName,
         category: category,
         userid: user?.uid,
      };
      addEntry(newEntry).catch(console.error);
      handleClose();
   };

   // Button for opening the modal
   const openButton = (
      <Button variant="contained" onClick={handleClickOpen}>
         Add entry
      </Button>
   );

   return (
      <div>
         {openButton} {/* Ensure the button is displayed */}
         <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{type === "edit" ? name : "Add Entry"}</DialogTitle>
            <DialogContent>
               <TextField
                  margin="normal"
                  id="name"
                  label="Name"
                  fullWidth
                  variant="standard"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
               />
               <TextField
                  margin="normal"
                  id="email"
                  label="Email"
                  fullWidth
                  variant="standard"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
               />
               <TextField
                  margin="normal"
                  id="description"
                  label="Description"
                  fullWidth
                  variant="standard"
                  multiline
                  maxRows={8}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
               />

               <FormControl fullWidth sx={{ marginTop: '20px' }}>
                  <InputLabel id="category-select-label">Category</InputLabel>
                  <Select
                     labelId="category-select-label"
                     id="category-select"
                     value={isCustomCategory ? 'custom' : category}
                     label="Category"
                     onChange={handleCategoryChange}
                  >
                     {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.name}>
                           {cat.name}
                        </MenuItem>
                     ))}
                     <MenuItem value="custom">Custom Category</MenuItem>
                  </Select>
               </FormControl>

               {isCustomCategory && (
                  <TextField
                     margin="normal"
                     id="custom-category"
                     label="Custom Category"
                     fullWidth
                     variant="standard"
                     value={customCategory}
                     onChange={handleCustomCategoryChange}
                  />
               )}
            </DialogContent>
            <DialogActions>
               <Button onClick={handleClose}>Cancel</Button>
               <Button variant="contained" onClick={handleAdd}>
                  Add Entry
               </Button>
            </DialogActions>
         </Dialog>
      </div>
   );
}
