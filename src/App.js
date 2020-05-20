import React from 'react';
import ItemList from "./ItemList";
import About from "./About";
import Layout from "./Layout";
import { BrowserRouter, Route } from "react-router-dom";
import Success from "./Success";
import Cancel from "./Cancel";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Route path="/" exact component={ItemList} />
        <Route path="/about" component={About} />
        <Route path="/success" component={Success} />
        <Route path="/cancel" component={Cancel} />
      </Layout>
    </BrowserRouter>
  );
}
