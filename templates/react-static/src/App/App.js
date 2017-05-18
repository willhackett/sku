import React, { Component } from 'react';
import {
  StyleGuideProvider,
  Header,
  Footer,
  PageBlock,
  Section,
  Text
} from 'seek-style-guide/react';

export default class App extends Component {
  render() {
    return (
      <StyleGuideProvider>
        <Header />

        <PageBlock>
          <Section header>
            <Text hero>Hello world!</Text>
          </Section>
        </PageBlock>

        <Footer />
      </StyleGuideProvider>
    );
  }
}
