<script>
// Added by Verrazzano
import HttpGet from '@/components/verrazzano/HttpGet';
import LabeledArrayList from '@/components/verrazzano/LabeledArrayList';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'LifecycleHook',
  components: {
    HttpGet,
    LabeledArrayList,
  },
  mixins: [VerrazzanoHelper],
  props:  {
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
      <h4>{{ t('verrazzano.config.titles.container.lifecycle.execCommands') }}</h4>
      <LabeledArrayList
        :value="getListField('exec.command')"
        :mode="mode"
        :value-label="t('verrazzano.config.fields.container.lifecycle.command')"
        :add-label="t('verrazzano.config.buttons.addExecCommand')"
        initial-empty-row
        @input="setFieldIfNotEmpty('exec.command', $event)"
      />
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.config.titles.httpGet') }}</h4>
      <HttpGet
        :value="getField('httpGet')"
        :mode="mode"
        @input="setFieldIfNotEmpty('httpGet', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
