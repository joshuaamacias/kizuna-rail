import { getCompleteRouteDetails, getTicketOptionsForRoute } from '../../models/model.js';

// TODO: getCompleteRouteDetails instead

export default async (req, res) => {
    const { routeId } = req.params;
    
    // Fetch comprehensive route details including start/end stations and raw schedules
    const details = await getCompleteRouteDetails(routeId);
    
    // If the route doesn't exist, handle it safely
    if (!details) {
        return res.status(404).render('404', { title: 'Route Not Found' });
    }

    // Fetch the dynamically computed ticket pricing classes for this route
    const ticketOptions = await getTicketOptionsForRoute(routeId);

    res.render('routes/details', { 
        title: `${details.name} Details`,
        details,
        ticketOptions // Send the calculated pricing array down to the EJS template
    });
};