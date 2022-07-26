<script>
// Added by Verrazzano
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import Labels from '@/components/verrazzano/Labels';
import OwnerReferences from '@/components/verrazzano/ObjectMetadata/OwnerReferences';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

import { NAMESPACE } from '@/config/types';
import { allHash } from '@/utils/promise';

export default {
  name:       'ObjectMetadata',
  components: {
    LabeledSelect,
    LabeledInput,
    Labels,
    OwnerReferences,
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
  data() {
    return { allNamespaces: [] };
  },
  async fetch() {
    const requests = { namespaces: this.$store.dispatch('cluster/findAll', { type: NAMESPACE }) };

    const hash = await allHash(requests);

    if (hash.namespaces) {
      this.allNamespaces = hash.namespaces;
    }
  },
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-6">
        <LabeledSelect
          :value="getField('namespace')"
          :mode="mode"
          :options="allNamespaces"
          option-label="metadata.name"
          :reduce="ns => ns.metadata.name"
          :placeholder="getNotSetPlaceholder(value, 'namespace')"
          :label="t('verrazzano.common.fields.namespace')"
          @input="setFieldIfNotEmpty('namespace', $event)"
        />
      </div>
      <div class="col span-6">
        <LabeledInput
          :value="getField('name')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'name')"
          :label="t('verrazzano.common.fields.name')"
          @input="setFieldIfNotEmpty('name', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div>
      <Labels v-model="value" :mode="mode" display-side-by-side />
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.common.titles.ownerReferences') }}</h4>
      <OwnerReferences v-model="value" :mode="mode" />
    </div>
  </div>
</template>

<style scoped>

</style>
