import { Route, Routes } from "react-router-dom";
import Loginpage from "./Pages/Loginpage";
import Dashboard from "./Pages/Dashboard";
import SiloBriefing from "./Pages/SiloBriefing";
import { GlobalProvider } from "./Context/context";
import { Client, Provider, defaultExchanges, subscriptionExchange } from "urql";
import { SubscriptionClient } from "subscriptions-transport-ws";
import "./App.css";

const HTTPServerURL = "https://graphileservertmd.onrender.com/graphql";
const WSServerURL = "https://graphileservertmd.onrender.com/graphql";

const subscriptionClient = new SubscriptionClient(WSServerURL, {
  reconnect: true,
});

const client = new Client({
  url: HTTPServerURL,
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: (operation) => subscriptionClient.request(operation),
    }),
  ],
});

function App() {
  return (
    <Provider value={client}>
      <GlobalProvider>
        <Routes>
          <Route path="/" element={<Loginpage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/silo/:id/details" element={<SiloBriefing />} />
          <Route path="*" element={<Loginpage />} />
        </Routes>
      </GlobalProvider>
    </Provider>
  );
}

export default App;
