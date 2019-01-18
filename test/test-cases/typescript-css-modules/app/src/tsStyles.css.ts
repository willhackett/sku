import styles from '../../../../../tss-modules';

const globals = {
  body: {
    background: 'blue'
  }
};

export default styles(
  {
    nested: {
      color: 'blue'
    },
    root: [
      { color: 'yellow' },
      {
        '& .nested': { color: 'green' }
      }
    ]
  },
  globals
);
