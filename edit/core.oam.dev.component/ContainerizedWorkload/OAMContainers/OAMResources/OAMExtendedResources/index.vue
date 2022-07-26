<script>
// Added by Verrazzano
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import ContainerizedWorkloadHelper from '@/mixins/verrazzano/containerized-workload-helper';
import OAMExtendedResource
  from '@/edit/core.oam.dev.component/ContainerizedWorkload/OAMContainers/OAMResources/OAMExtendedResources/OAMExtendedResource';

import { randomStr } from '@/utils/string';
import debounce from 'lodash/debounce';

export default {
  name:       'OAMExtendedResources',
  components: {
    ArrayListGrouped,
    OAMExtendedResource,
  },
  mixins: [ContainerizedWorkloadHelper],
  props:  {
    value: {
      // parent object (e.g., OAM Resources object)
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create',
    },
  },
  data() {
    const extendedResources = (this.value.extended || []).map((extendedResource) => {
      const newExtendedResource = this.clone(extendedResource);

      newExtendedResource._id = randomStr(4);

      return newExtendedResource;
    });

    return { extendedResources };
  },
  computed: {
    showExtendedResourceRemoveButton() {
      return !this.isView && Array.isArray(this.extendedResources) && this.extendedResources.length > 0;
    },
  },
  methods: {
    update() {
      const extendedResources = [];

      this.extendedResources.forEach((extendedResource) => {
        const newExtendedResource = this.clone(extendedResource);

        delete newExtendedResource._id;

        extendedResources.push(newExtendedResource);
      });

      this.setFieldIfNotEmpty('extended', extendedResources);
    },
    addExtendedResource() {
      this.extendedResources.push({ _id: randomStr(4) });
    },
    removeExtendedResource(index) {
      this.extendedResources.splice(index, 1);

      this.queueUpdate();
    },
  },
  created() {
    this.queueUpdate = debounce(this.update, 500);
  },
};
</script>

<template>
  <ArrayListGrouped
    v-model="extendedResources"
    :mode="mode"
    :default-add-value="{ }"
    :add-label="t('verrazzano.containerized.buttons.addExtendedResource')"
    @add="addExtendedResource()"
  >
    <template #remove-button="removeProps">
      <button
        v-if="showExtendedResourceRemoveButton"
        type="button"
        class="btn role-link close btn-sm"
        @click="removeExtendedResource(removeProps.i)"
      >
        <i class="icon icon-2x icon-x" />
      </button>
      <span v-else />
    </template>
    <template #default="props">
      <OAMExtendedResource
        v-model="props.row.value"
        :mode="mode"
      />
    </template>
  </ArrayListGrouped>
</template>

<style scoped>

</style>
