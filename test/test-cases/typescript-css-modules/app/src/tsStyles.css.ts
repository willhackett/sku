import { cls, stylesheet } from '../../../../../tss-modules';

const nested = cls();

const root = cls(
  { color: 'green' },
  {
    [`& ${nested}`]: { color: 'pink' }
  }
);

const globals = {
  body: {
    background: 'blue'
  }
};

export default stylesheet({ root, nested }, globals);
