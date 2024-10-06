const app_name = 'mistryproject-a847f1548531.herokuapp.com/';
exports.buildPath = 
function buildPath(route)
{
    if (process.env.NODE_ENV === 'production') 
    {
        return 'https://' + app_name + route;
    }
    else
    {        
        return 'http://localhost:3000/' + route;
    }
}
