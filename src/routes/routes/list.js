import { getAllRoutes, getListOfRegions, getListOfSeasons } from '../../models/model.js';

export default async (req, res) => {
    const regions = await getListOfRegions();
    let routes = await getAllRoutes();
    const seasons = await getListOfSeasons();

    // Extract query parameters from the URL (e.g., ?region=central&season=autumn)
    const { region, season } = req.query;

   
    if (region) {
        routes = routes.filter(route => route.region && route.region.toLowerCase() === region.toLowerCase());
    }

    // fixing the season, has to be bestSeason because that's what the JSON data provides, no reason to change it in the JSON data just for this filter
if (season) {
    // Keep using .bestSeason here because that's what the JSON data provides!
    routes = routes.filter(route => route.bestSeason && route.bestSeason.toLowerCase() === season.toLowerCase());
}

    res.render('routes/list', { 
        title: 'Scenic Train Routes',
        regions,
        routes,
        seasons,
        // Pass current filters back to the view so we can keep dropdowns selected
        currentRegion: region || '',
        currentSeason: season || ''
    });
};