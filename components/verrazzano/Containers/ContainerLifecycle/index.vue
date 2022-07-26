<script>
// Added by Verrazzano
import LifecycleHook from '@/components/verrazzano/Containers/ContainerLifecycle/LifecycleHook';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'ContainerLifecycle',
  components: { LifecycleHook },
  mixins:     [VerrazzanoHelper],
  props:      {
    value: {
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create'
    },
  },
};
</script>

<template>
  <div>
    <div>
      <h4>{{ t('verrazzano.config.titles.container.lifecycle.postStart') }}</h4>
      <LifecycleHook
        :value="getField('postStart')"
        :mode="mode"
        @input="setFieldIfNotEmpty('postStart', $event)"
      />
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.config.titles.container.lifecycle.preStop') }}</h4>
      <LifecycleHook
        :value="getField('preStop')"
        :mode="mode"
        @input="setFieldIfNotEmpty('preStop', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
