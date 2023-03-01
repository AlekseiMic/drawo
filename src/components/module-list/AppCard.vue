<script lang="ts">
import OmegaLink from '@ui/OmegaLink.vue';
import MultiplayerSvg from '@assets/svg/multiplayer.svg?component';

export default {
  components: { OmegaLink, MultiplayerSvg },
  props: {
    name: { type: String, default: '' },
    url: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: null },
    multiplayer: Boolean,
  },
};
</script>

<template>
  <OmegaLink :to="url">
    <article>
      <div class="info">
        <span class="name">{{ name }}</span>
        <span v-if="multiplayer" class="multiplayer">
          <MultiplayerSvg />
        </span>
      </div>
      <div class="image-wrapper">
        <component :is="image" class="image" />
      </div>
      <div class="description">{{ description }}</div>
    </article>
  </OmegaLink>
</template>

<style scoped lang="scss">
article {
  border-radius: 5px;
  height: 100%;
  padding: 16px;
  min-width: 240px;
  box-shadow: -1px 1px 2px 2px var(--c-default-shadow);
  background: var(--c-default-background-80);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.description {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  background: rgba(0, 0, 0, 0.3);
  display: none;
  color: #fff;
  align-items: center;
  justify-content: center;
  text-align: center;
  backdrop-filter: blur(0px);
  text-shadow: 2px 2px 2px black;
  padding: 8px;
  display: flex;
  font-size: 0;
  transition: all ease-in 0.1s;
  font-size: 2.2rem;
  font-weight: 700;
  opacity: 0;
}

a:focus,
a:hover {
  outline: none;
  & article {
    box-shadow: none;
  }
  & .description {
    backdrop-filter: blur(4px);
    opacity: 1;
  }
}

.image-wrapper {
  width: 100%;
  padding-top: 56.25%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.image {
  max-height: 100%;
  max-width: 100%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: calc(80% - 16px);
}
.info {
  color: var(--c-default-text);
  margin: 0px 0 20px 0;
  text-align: center;
}
.name {
  font-size: 2.2rem;
  line-height: 2.2rem;
  font-weight: bold;
}
.multiplayer {
  position: absolute;
  right: 6px;
  bottom: 6px;
  display: block;
  width: 20px;
  height: 20px;
}
.multiplayer > svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
}
</style>
