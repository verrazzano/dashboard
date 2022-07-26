<script>
// Added by Verrazzano
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import Container from '@/components/verrazzano/Containers/Container';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

import { randomStr } from '@/utils/string';
import debounce from 'lodash/debounce';

export default {
  name:       'Containers',
  components: {
    ArrayListGrouped,
    Container,
  },
  mixins: [VerrazzanoHelper],
  props:  {
    value: {
      // parent object (e.g., pod spec)
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create'
    },
    rootFieldName: {
      type:    String,
      default: 'containers'
    },
    addButtonLabel: {
      type:    String,
      default: ''
    },
    useEphemeralContainers: {
      type:    Boolean,
      default: false
    },
    namespacedObject: {
      type:     Object,
      required: true
    }
  },
  data() {
    const containers = (this.value[this.rootFieldName] || []).map((container) => {
      const newContainer = this.clone(container);

      newContainer._id = randomStr(4);

      return newContainer;
    });

    return {
      addButtonLabelText: this.addButtonLabel,
      containers
    };
  },
  methods: {
    update() {
      const containers = [];

      this.containers.forEach((container) => {
        const newContainer = this.clone(container);

        delete newContainer._id;

        containers.push(newContainer);
      });

      this.setFieldIfNotEmpty(this.rootFieldName, containers);
    },
    addContainer() {
      this.containers.push({ _id: randomStr(4) });
    },
    removeContainer(index) {
      this.containers.splice(index, 1);

      this.queueUpdate();
    }
  },
  created() {
    if (!this.addButtonLabelText) {
      this.addButtonLabelText = this.t('verrazzano.config.buttons.addContainer');
    }

    this.queueUpdate = debounce(this.update, 500);
  }
};
</script>

<template>
  <div>
    <ArrayListGrouped
      v-model="value[rootFieldName]"
      :mode="mode"
      :default-add-value="{ }"
      :add-label="addButtonLabelText"
      @add="addContainer()"
    >
      <template #remove-button="removeProps">
        <button
          v-if="showListRemoveButton(rootFieldName)"
          type="button"
          class="btn role-link close btn-sm"
          @click="removeContainer(removeProps.i)"
        >
          <i class="icon icon-2x icon-x" />
        </button>
        <span v-else />
      </template>
      <template #default="props">
        <Container
          v-model="props.row.value"
          :mode="mode"
          :is-ephemeral="useEphemeralContainers"
          :namespaced-object="namespacedObject"
        />
      </template>
    </ArrayListGrouped>
  </div>
</template>

<style scoped>

</style>
