<script lang="ts">
import OmegaLink from '../components/ui/OmegaLink.vue';

export default { components: { OmegaLink } };
</script>

<template>
  <div class="error">
    <span class="code">404</span>
    <span class="message">Page not found</span>
    <span class="description"
      >The page you're looking for could not be found</span
    >
    <OmegaLink class="home-link" to="/">Go home</OmegaLink>
  </div>
</template>

<style scoped lang="scss">
.error {
  background: var(--c-default-background-120);
  position: absolute;
  width: 420px;
  height: 480px;
  max-width: 100vw;
  max-height: 100vh;
  box-shadow: -1px 1px 10px 3px var(--c-default-shadow);
  border-radius: 5px;
  left: 50%;
  top: 50%;
  padding: 16px;
  transform: translate(-50%, -50%);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.code {
  display: block;
  color: var(--c-default-text);
  margin-top: -50px;
  font-size: 20rem;
  line-height: 20rem;
  font-weight: bold;
  text-shadow: 1px 2px 0px rgba(255, 60, 60, 0.7);
}
.message {
  display: block;
  margin-top: 10px;
  font-size: 3.5rem;
  line-height: 3.5rem;
  font-weight: bold;
  text-transform: uppercase;
}
.description {
  margin-top: 20px;
  font-size: 1.8rem;
  line-height: 1.9rem;
  padding: 0 80px;
}
.home-link {
  width: 150px;
  margin: 30px auto 0 auto;
  border-radius: 5px;
  font-size: 1.8rem;
  display: block;
  padding: 6px 30px;
  background: var(--c-default-background-80);
  box-shadow: 1px 2px 0px 0px rgba(255, 60, 60, 0.7);
  color: var(--c-default-text);
  &:hover {
    background: var(--c-default-background);
  }
  &:focus {
    background: var(--c-default-background-60);
  }
}
</style>
