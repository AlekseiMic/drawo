import InputWrapper from './InputWrapper.vue';

export default {
  title: 'InputWrapper',
  component: InputWrapper,
  argTypes: {},
};

const Template = (args) => ({
  components: { InputWrapper },
  setup() {
    return { args };
  },
  template: '<input-wrapper v-bind="args"><div>Some input</div></input-wrapper>',
});

export const Primary = Template.bind({});

Primary.args = {
  label: 'Label',
};

export const Compact = Template.bind({});
Compact.args = {
  label: 'Label',
  compact: true,
};

export const ReverseCompact = Template.bind({});
ReverseCompact.args = {
  label: 'Label',
  compact: true,
  reverse: true,
};

export const PrimaryError = Template.bind({});

PrimaryError.args = {
  label: 'Label',
  error: 'Error'
};

export const CompactError = Template.bind({});
CompactError.args = {
  label: 'Label',
  compact: true,
  error: 'Error'
};

