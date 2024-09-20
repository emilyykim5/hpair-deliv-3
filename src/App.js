import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Stack from "@mui/material/Stack";
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import firebase from 'firebase/compat/app';
import { useEffect, useState } from "react";
import './App.css';
import BasicTable from './components/BasicTable';
import EntryModal from './components/EntryModal';
import { mainListItems } from './components/listItems';
import { emptyEntry } from './utils/mutations';
import StyledFirebaseAuth from './components/StyledFirebaseAuth.tsx';

// MUI styling constants
const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme({
  palette: {
    primary: {
      main: '#770312',
    },
    secondary: {
      main: '#fff',
    },
  },
});

// FirebaseUI configuration
const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    signInSuccessWithAuthResult: async (authResult) => {
      const user = authResult.user;
      try {
        const email = user.email;
        const methods = await firebase.auth().fetchSignInMethodsForEmail(email);
        
        if (methods.length > 0 && !methods.includes('password')) {
          // If account already exists, prevent account creation
          alert('This email already has an account. Please log in.');
          await firebase.auth().signOut();
        } else {
          console.log("Signed in successfully.");
        }
      } catch (error) {
        console.error('Error fetching sign-in methods:', error);
      }
      return false; // Prevent redirect after sign-in
    },
    signInFailure: (error) => {
      if (error.code === 'auth/email-already-in-use') {
        alert("This email is already in use. Please log in.");
        return firebase.auth().signOut();
      }
      return Promise.resolve();
    },
  },
};

// Main App component
export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state
  const [currentUser, setCurrentUser] = useState(null); // Local user info

  // Listen to Firebase Auth state and set the local state
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      setIsSignedIn(!!user);
      setCurrentUser(user || null);
    });
    return () => unregisterAuthObserver(); // Clean up Firebase observer when component unmounts
  }, []);

  // Drawer toggle state
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  // Main content rendering based on authentication
  function mainContent() {
    if (isSignedIn) {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack direction="row" spacing={3}>
              <EntryModal entry={emptyEntry} type="add" user={currentUser} />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <BasicTable entries={[]} />
          </Grid>
        </Grid>
      );
    } else {
      return (
        <div>
          <h1>Sign in</h1>
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </div>
      );
    }
  }

  // MenuBar component
  const MenuBar = () => (
    <AppBar position="absolute" open={open}>
      <Toolbar sx={{ pr: '24px' }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          sx={{ marginRight: '36px', ...(open && { display: 'none' }) }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          Speaker Outreach
        </Typography>
        {isSignedIn && (
          <>
            <Typography component="h1" variant="body1" color="inherit" noWrap>
              Signed in as {currentUser?.displayName}
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => firebase.auth().signOut()}
            >
              Log out
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <MenuBar />
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">{mainListItems}</List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {mainContent()}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
