import PsiInput from './PsiInput.vue';

export default {
  title: 'PsiInput',
  component: PsiInput,
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'number'],
    },
  },
};

const Template = (args) => ({
  components: { PsiInput },
  setup() {
    return { args };
  },
  template: '<psi-input v-bind="args"/>',
});

export const Text = Template.bind({});

Text.args = {
  type: 'text',
  label: 'Text input',
  placeholder: 'input here...',
};

export const Numeric = Template.bind({});

Numeric.args = {
  type: 'number',
  label: 'Numeric input',
  placeholder: 'input your number here...',
};
