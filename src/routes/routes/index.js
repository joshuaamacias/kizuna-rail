import { bookingPage, processBookingRequest } from './book.js';
import confirmationPage from './confirm.js';
import listRoutesPage from './list.js';
import routeDetailsPage from './details.js';
import { Router } from 'express';

const router = Router();

// List all routes
router.get('/', listRoutesPage);

// Route details page
router.get('/:routeId', routeDetailsPage);

// Book ticket
router.get('/booking/:scheduleId', bookingPage);
router.post('/book', processBookingRequest);

// Booking confirmation page
router.get('/confirmation/:confirmationId', confirmationPage);


  // ERROR HANDLING MIDDLEWARE

router.use((req, res, next) => {
    res.status(404);
    res.render('errors/404', { 
        title: 'Page Not Found',
        url: req.originalUrl
    });
});

router.use((err, req, res, next) => {
    console.error("Internal Server Error caught:", err.message);
    
    res.status(500);
    res.render('errors/500', { 
        title: 'Something Went Wrong',
        // Passes the raw error only in development mode so you don't show stack traces to live users
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

export default router;