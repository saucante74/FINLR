import { route as ziggyRoute } from 'ziggy-js';

declare global {
    // eslint-disable-next-line no-var
    var route: typeof ziggyRoute;
}
