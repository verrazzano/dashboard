<script>
// Added by Verrazzano
import LabeledInput from '@/components/form/LabeledInput';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';
import { _VIEW } from '@/config/query-params';

export default {
  name:       'AddNamedElement',
  components: { LabeledInput },
  mixins:     [VerrazzanoHelper],
  props:      {
    mode: {
      type:     String,
      required: true,
    },
    addLabel: {
      type:     String,
      required: true,
    },
    configNode: {
      type:     Array,
      required: true,
    },
    configKey: {
      type:     String,
      required: true,
    },
    nameLabel: {
      type:     String,
      required: true,
    },
    namePrefix: {
      type:    String,
      default: undefined,
    }
  },

  data() {
    return {
      newName:      undefined,
      errorMessage: undefined,
    };
  },

  methods: {
    getUnusedName() {
      const namePrefix = this.namePrefix ? this.namePrefix : 'new';

      return this.getNextName(this.configNode, this.configKey, namePrefix);
    },

    checkName() {
      this.errorMessage = undefined;

      if (!this.newName) {
        this.errorMessage = this.t('verrazzano.common.messages.enterName');

        return false;
      }

      if (typeof this.configNode !== 'undefined') {
        if (!this.configNode.every(node => this.newName !== node[this.configKey])) {
          this.errorMessage = this.t('verrazzano.common.messages.nameInUse', { name: this.newName });

          return false;
        }
      }

      return true;
    },

    returnName() {
      if (this.checkName()) {
        this.$emit('input', this.newName);

        this.newName = this.getUnusedName();
      }
    }
  },

  mounted() {
    this.newName = this.getUnusedName();
  },

  computed: {
    isView() {
      return this.mode === _VIEW;
    },
  },

  watch: {
    newName() {
      this.checkName();
    },
  },
};
</script>

<template>
  <div>
    <LabeledInput
      v-model="newName"
      :mode="mode"
      :label="nameLabel"
      required
    />
    <div v-if="!isView && errorMessage">
      <br />
      <span class="named-error">{{ errorMessage }}</span>
    </div>
    <br />
    <button
      type="button"
      class="btn role-tertiary add"
      data-testid="add-item"
      :disabled="isView || errorMessage"
      @click="returnName()"
    >
      {{ addLabel }}
    </button>
  </div>
</template>

<style scoped>
.named-error {
  color: var(--error);
}
</style>
