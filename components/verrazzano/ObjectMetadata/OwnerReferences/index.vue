<script>
// Added by Verrazzano
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import OwnerReference from '@/components/verrazzano/ObjectMetadata/OwnerReferences/OwnerReference';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

import { randomStr } from '@/utils/string';
import debounce from 'lodash/debounce';

export default {
  name:       'OwnerReferences',
  components: {
    ArrayListGrouped,
    OwnerReference,
  },
  mixins: [VerrazzanoHelper],
  props:  {
    // parent object (e.g., metadata object)
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
    const ownerReferences = (this.value.ownerReferences || []).map((ref) => {
      const newRef = this.clone(ref);

      newRef._id = randomStr(4);

      return newRef;
    });

    return { ownerReferences };
  },
  methods: {
    update() {
      const ownerReferences = [];

      this.ownerReferences.forEach((ref) => {
        const newRef = this.clone(ref);

        delete newRef._id;

        ownerReferences.push(newRef);
      });

      this.setFieldIfNotEmpty('ownerReferences', ownerReferences);
    },
    addOwnerReference() {
      this.ownerReferences.push({ _id: randomStr(4) });
    },
    removeOwnerReference(index) {
      this.ownerReferences.splice(index, 1);

      this.queueUpdate();
    }
  },
  created() {
    this.queueUpdate = debounce(this.update, 500);
  }
};
</script>

<template>
  <div>
    <ArrayListGrouped
      v-model="value['ownerReferences']"
      :mode="mode"
      :default-add-value="{ }"
      :add-label="t('verrazzano.common.buttons.addOwnerReference')"
      @add="addOwnerReference()"
    >
      <template #remove-button="removeProps">
        <button
          v-if="showListRemoveButton('ownerReferences')"
          type="button"
          class="btn role-link close btn-sm"
          @click="removeOwnerReference(removeProps.i)"
        >
          <i class="icon icon-2x icon-x" />
        </button>
        <span v-else />
      </template>
      <template #default="props">
        <OwnerReference v-model="props.row.value" :mode="mode" />
      </template>
    </ArrayListGrouped>
  </div>
</template>

<style scoped>

</style>
