import styles from '../../../../../tss-modules';

const globals = {
  html: {
    background: 'blue',
    select: {
      body: {
        margin: 0
      }
    }
  }
};

export default styles(
  {
    nested: {
      color: 'blue'
    },
    root: {
      color: 'yellow',
      select: {
        '& .nested': {
          color: 'green',
          select: {
            '@media screen and (max-width: 800px)': {
              textDecoration: 'underline'
            }
          }
        }
      }
    }
  },
  globals
);
