"use client";

import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material';
import { firestore, app } from '@/firebase'; // Ensure this is the correct path to your firebase config
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, getDocs, query, setDoc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const containerStyle = {
  width: '90%',
  maxWidth: '1200px',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 2,
  mx: 'auto',
  p: 2,
};

const headerStyle = {
  width: '100%',
  maxWidth: '800px',
  bgcolor: '#f5f5f5',
  border: '2px solid #000',
  borderRadius: '8px',
  p: 2,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const itemStyle = {
  width: 'calc(100% - 100px)', // Responsive width minus button width
  height: '50px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  bgcolor: '#fafafa',
  borderRadius: '8px',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  border: '2px solid #000',
  p: 2,
};

export default function HomePage() {
  const [pantryList, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [editItem, setEditItem] = useState('');
  const [newQuantity, setNewQuantity] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const auth = getAuth(app);

  const handleAuthOpen = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthClose = () => {
    setEmail('');
    setPassword('');
    setAuthModalOpen(false);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setItemName('');
    setEditItem('');
    setNewQuantity(0);
    setOpen(false);
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        updatePantry();
      } else {
        setUser(null);
      }
    });
  }, []);

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      handleAuthClose();
    } catch (error) {
      console.error("Error signing up: ", error);
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      handleAuthClose();
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  const updatePantry = async () => {
    try {
      const q = query(collection(firestore, 'pantry'));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        quantity: doc.data().quantity || 0
      }));
      setPantry(items);
    } catch (error) {
      console.error("Error fetching pantry items: ", error);
    }
  };

  const addItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'pantry'), item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Item exists, update quantity
        await updateDoc(docRef, {
          quantity: (docSnap.data().quantity || 0) + 1
        });
      } else {
        // Item does not exist, create with quantity 1
        await setDoc(docRef, { quantity: 1 });
      }

      updatePantry();
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  };

  const removeItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'pantry'), item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentQuantity = docSnap.data().quantity || 0;

        if (currentQuantity > 1) {
          // Reduce quantity
          await updateDoc(docRef, { quantity: currentQuantity - 1 });
        } else {
          // Delete item if quantity is 0
          await deleteDoc(docRef);
        }

        updatePantry();
      }
    } catch (error) {
      console.error("Error removing item: ", error);
    }
  };

  const changeQuantity = async (item, newQuantity) => {
    try {
      const docRef = doc(collection(firestore, 'pantry'), item);
      await updateDoc(docRef, { quantity: newQuantity });
      updatePantry();
    } catch (error) {
      console.error("Error changing quantity: ", error);
    }
  };

  const filteredPantryList = pantryList.filter(item =>
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={containerStyle}>
      <Modal
        open={authModalOpen}
        onClose={handleAuthClose}
        aria-labelledby="auth-modal-title"
        aria-describedby="auth-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="auth-modal-title" variant="h6" component="h2">
            {authMode === 'login' ? 'Login' : 'Sign Up'}
          </Typography>
          <TextField
            id="email-input"
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            id="password-input"
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {authMode === 'login' ? (
            <Button variant="contained" onClick={handleLogin}>
              Login
            </Button>
          ) : (
            <Button variant="contained" onClick={handleSignUp}>
              Sign Up
            </Button>
          )}
        </Box>
      </Modal>

      {user ? (
        <>
          <Button variant="contained" onClick={handleLogout}>
            Logout
          </Button>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {editItem ? 'Change Quantity' : 'Add Items'}
              </Typography>
              {editItem ? (
                <Stack width="100%" direction="row" spacing={2}>
                  <TextField
                    id="quantity-input"
                    label="New Quantity"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(Number(e.target.value))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        changeQuantity(editItem, newQuantity);
                        handleClose();
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => {
                      changeQuantity(editItem, newQuantity);
                      handleClose();
                    }}
                  >
                    Confirm
                  </Button>
                </Stack>
              ) : (
                <Stack width="100%" direction="row" spacing={2}>
                <TextField
                  id="outlined-basic"
                  label="Item"
                  variant="outlined"
                  fullWidth
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addItem(itemName);
                      handleClose();
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={() => {
                    addItem(itemName);
                    handleClose();
                  }}
                >
                  Add
                </Button>
              </Stack>
            )}
          </Box>
        </Modal>

        <Button variant="contained" onClick={handleOpen}>
          Add Items
        </Button>

        <Box sx={headerStyle}>
          <Typography variant="h4" color="#333" textAlign="center">
            Pantry Items
          </Typography>
        </Box>

        <Stack width="100%" maxWidth="800px" direction="row" spacing={2} mb={2}>
          <TextField
            id="search-input"
            label="Search"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Stack>

        <Stack
          width="100%"
          maxWidth="800px"
          spacing={2}
          sx={{
            maxHeight: '300px', // Limit height for scroll
            overflowY: 'auto', // Enable vertical scroll
          }}
        >
          {filteredPantryList.map((item) => (
            <Stack
              key={item.id}
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Box sx={itemStyle}>
                <Typography variant="h6" color="textPrimary">
                  {item.id.charAt(0).toUpperCase() + item.id.slice(1)} ({item.quantity})
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" onClick={() => {
                  setEditItem(item.id);
                  setNewQuantity(item.quantity);
                  handleOpen();
                }}>
                  Update
                </Button>
                <Button variant="contained" color="error" onClick={() => removeItem(item.id)}>
                  Remove
                </Button>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </>
    ) : (
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Pantry Tracker
        </Typography>
        <Button
          variant="contained"
          onClick={() => handleAuthOpen('login')}
          sx={{ margin: '0 10px' }}
        >
          Login
        </Button>
        <Button
          variant="contained"
          onClick={() => handleAuthOpen('signup')}
          sx={{ margin: '0 10px' }}
        >
          Sign Up
        </Button>
      </Box>
    )}
  </Box>
);
}
