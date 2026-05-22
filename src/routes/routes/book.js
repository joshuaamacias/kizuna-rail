import { createConfirmation, getScheduleById, getTicketOptionsForRoute } from '../../models/model.js';

const bookingPage = async (req, res) => {
    const { scheduleId } = req.params;

    const schedule = await getScheduleById(scheduleId);

    const ticketOptions = await getTicketOptionsForRoute(schedule.routeId, scheduleId);

    res.render('routes/book', {
        title: 'Book Trip',
        schedule,
        ticketOptions
    });
};

const processBookingRequest = async (req, res) => {
    try {
        const data = req.body;
        
        // 1. Extract values from the submitted form body
        const scheduleId = data.scheduleId;
        const selectedClass = data.ticketClass;
        const passengerQuantity = parseInt(data.quantity, 10) || 1;

        // 2. Look up the schedule to find its associated routeId
        const schedule = await getScheduleById(scheduleId);
        if (!schedule) {
            return res.status(404).render('404', { title: 'Schedule Not Found' });
        }

        // 3. Look up the dynamically priced ticket options for this route
        const ticketOptions = await getTicketOptionsForRoute(schedule.routeId);
        
        // 4. Find the matching ticket option chosen by the user
        const matchedOption = ticketOptions.find(
            option => option.class.toLowerCase() === selectedClass.toLowerCase()
        );

        // Fallback default pricing if for some reason a match isn't found
        const pricePerTicket = matchedOption ? matchedOption.price : 0;

        // 5. Calculate the absolute total ticket cost
        const totalPrice = pricePerTicket * passengerQuantity;

        // 6. Inject the calculated price details right into the confirmation object
        const finalBookingData = {
            ...data,
            pricePerTicket: pricePerTicket,
            totalPrice: totalPrice,
            quantity: passengerQuantity
        };

        // Save confirmation record to data file and obtain the reference ID string
        const confirmationNum = await createConfirmation(finalBookingData);

        // Redirect passenger directly to their custom confirmation page
        res.redirect(`/routes/confirmation/${confirmationNum}`);
        
    } catch (error) {
        console.error('Booking processing error:', error);
        res.status(500).render('500', { title: 'Booking Processing Failed' });
    }
};

export { bookingPage, processBookingRequest };