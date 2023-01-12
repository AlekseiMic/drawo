import OmicronRadio from './OmicronRadio.vue';

export default {
  title: 'OmicronRadio',
  component: OmicronRadio,
  argTypes: {
    options: {
      control: { type: 'array' },
      label: { control: 'text' },
      value: { control: 'text' },
    },
  },
};

const Template = (args) => ({
  components: { InputWrapper: OmicronRadio },
  setup() {
    return { args };
  },
  template: '<omicron-radion v-bind="args"></input-wrapper>',
});

export const Primary = Template.bind({});

Primary.args = {
  options: [
    { label: 'First', value: 'first' },
    { label: 'Second', value: 'second' },
  ],
};

