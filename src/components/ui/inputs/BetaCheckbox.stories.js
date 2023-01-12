import BetaCheckbox from './BetaCheckbox.vue';

export default {
  title: 'BetaCheckbox',
  component: BetaCheckbox,
  argTypes: {},
};

const Template = (args) => ({
  components: { BetaCheckbox },
  setup() {
    return { args };
  },
  template: '<beta-checkbox v-bind="args" />',
});

export const Primary = Template.bind({});

Primary.args = {
  label: 'Checkbox',
};

export const Compact = Template.bind({});

Compact.args = {
  label: 'Compact Checkbox',
  compact: true,
};

export const ReverseCompact = Template.bind({});

ReverseCompact.args = {
  label: 'Reverse Compact Checkbox',
  compact: true,
  reverse: true,
};
