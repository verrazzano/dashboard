<script>
// Added by Verrazzano
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import LabeledArrayList from '@/components/verrazzano/LabeledArrayList';
import LabeledInput from '@/components/form/LabeledInput';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

import debounce from 'lodash/debounce';

export default {
  name:       'HostAliases',
  components: {
    ArrayListGrouped,
    LabeledArrayList,
    LabeledInput,
  },
  mixins: [VerrazzanoHelper],
  props:  {
    value: {
      type:    Array,
      default: () => ([])
    },
    mode: {
      type:    String,
      default: 'create'
    }
  },
  data() {
    const hostAliases = [];

    this.value.forEach((hostAlias) => {
      hostAliases.push(this.clone(hostAlias));
    });

    return { hostAliases };
  },
  computed: {
    showRemoveButton() {
      return !this.isView && this.hostAliases.length > 0;
    }
  },
  methods: {
    update() {
      const hostAliases = [];

      this.hostAliases.forEach((hostAlias) => {
        hostAliases.push(this.clone(hostAlias));
      });
      this.$emit('input', hostAliases);
    },
    addHostAlias() {
      this.hostAliases.push({});
      this.queueUpdate();
    },
    removeHostAlias(index) {
      this.hostAliases.splice(index, 1);
      this.queueUpdate();
    },
    setLocalField(obj, fieldName, value) {
      this.set(obj, fieldName, value);
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
      v-model="hostAliases"
      :mode="mode"
      :default-add-value="{ }"
      :add-label="t('verrazzano.config.buttons.addHostAlias')"
      @add="addHostAlias()"
    >
      <template #remove-button="removeProps">
        <button
          v-if="showRemoveButton"
          type="button"
          class="btn role-link close btn-sm"
          @click="removeHostAlias(removeProps.i)"
        >
          <i class="icon icon-2x icon-x" />
        </button>
        <span v-else />
      </template>
      <template #default="props">
        <div class="row">
          <div class="col span-4">
            <LabeledInput
              :value="get(props.row.value, 'ip')"
              :mode="mode"
              :label="t('verrazzano.config.fields.hostAliases.ip')"
              required
              @input="setLocalField(props.row.value, 'ip', $event)"
            />
          </div>
          <div class="col span-4">
            <LabeledArrayList
              :value="get(props.row.value, 'hostnames')"
              :mode="mode"
              :value-label="t('verrazzano.config.fields.hostAliases.hostname')"
              :add-label="t('verrazzano.config.buttons.addHostName')"
              initial-empty-row
              required
              @input="setLocalField(props.row.value, 'hostnames', $event)"
            />
          </div>
        </div>
      </template>
    </ArrayListGrouped>
  </div>
</template>

<style scoped>

</style>
