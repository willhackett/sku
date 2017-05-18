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
        <Header locale={process.env.LOCALE} />

        <PageBlock>
          <Section header>
            <Text data-automation="hello" hero>Hello world!</Text>
          </Section>
        </PageBlock>

        <Footer locale={process.env.LOCALE} />
      </StyleGuideProvider>
    );
  }
}
