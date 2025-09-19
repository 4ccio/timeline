import Timeline from 'components/Timeline';
import { timelinePeriods } from './data/data';

const App = () => (
    <div className="app">
        <Timeline periods={timelinePeriods} />
    </div>
);

export default App;
