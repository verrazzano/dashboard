<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import LabeledInput from '@/components/form/LabeledInput';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'OwnerReference',
  components: {
    Checkbox,
    LabeledInput,
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
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('apiVersion')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'apiVersion')"
          :label="t('verrazzano.common.fields.ownerReference.apiVersion')"
          @input="setFieldIfNotEmpty('apiVersion', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('kind')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'kind')"
          :label="t('verrazzano.common.fields.ownerReference.kind')"
          @input="setFieldIfNotEmpty('kind', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('name')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'name')"
          :label="t('verrazzano.common.fields.ownerReference.name')"
          @input="setFieldIfNotEmpty('name', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-4">
        <Checkbox
          :value="getField('controller')"
          :mode="mode"
          :label="t('verrazzano.common.fields.ownerReference.controller')"
          @input="setBooleanField('controller', $event)"
        />
        <div class="spacer-tiny" />
        <Checkbox
          :value="getField('blockOwnerDeletion')"
          :mode="mode"
          :label="t('verrazzano.common.fields.ownerReference.blockOwnerDeletion')"
          @input="setBooleanField('blockOwnerDeletion', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('uid')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'uid')"
          :label="t('verrazzano.common.fields.ownerReference.uid')"
          @input="setFieldIfNotEmpty('uid', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .spacer-tiny {
    padding: 5px 0 0 0;
  }
</style>
