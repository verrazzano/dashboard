// Added by Verrazzano
<script>
import NameNsDescription from '@/components/form/NameNsDescription';
import Labels from '@/components/form/Labels';
import { HIDE_SENSITIVE } from '@/store/prefs';
import { sortBy } from '@/utils/sort';
import LabeledSelect from '@/components/form/LabeledSelect.vue';
import LabeledInput from '~/components/form/LabeledInput.vue';
import OamComponentHelper from '@/mixins/verrazzano/oam-component-helper';
import { TYPES } from './secret-helper';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import TreeTabbed from '@/components/verrazzano/TreeTabbed';
import LabelsTab from '@/components/verrazzano/LabelsTab';

export default {
  name: 'Secret',

  components: {
    NameNsDescription,
    Labels,
    LabeledSelect,
    LabeledInput,
    TreeTab,
    TreeTabbed,
    LabelsTab,
  },

  mixins: [OamComponentHelper],

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

  computed: {
    type: {
      get() {
        return this.getWorkloadField('type');
      },
      set(neu) {
        this.setWorkloadFieldIfNotEmpty('type', neu);
      }
    },
    typeKey() {
      switch ( this.type) {
      case TYPES.TLS: return 'tls';
      case TYPES.BASIC: return 'basic';
      case TYPES.DOCKER_JSON: return 'registry';
      case TYPES.SSH: return 'ssh';
      case TYPES.OPAQUE: return 'generic';
      default: return undefined;
      }
    },
    dataComponent() {
      return require(`@/edit/core.oam.dev.component/Secret/${ this.typeKey }`).default;
    },

    // array of value/labels of secret types
    secretOptions() {
      const out = [];

      [
        TYPES.OPAQUE,
        TYPES.DOCKER_JSON,
        TYPES.TLS,
        TYPES.SSH,
        TYPES.BASIC,
      ].forEach((secretType) => {
        out.push({
          value:       secretType,
          label:       this.typeDisplay(secretType),
        });
      });

      return sortBy(out, 'label');
    },

    hideSensitiveData() {
      return this.$store.getters['prefs/get'](HIDE_SENSITIVE);
    },

    dataLabel() {
      switch (this.type) {
      case TYPES.TLS:
        return this.t('secret.certificate.certificate');
      case TYPES.SSH:
        return this.t('secret.ssh.keys');
      case TYPES.BASIC:
        return this.t('secret.authentication');
      default:
        return this.t('secret.data');
      }
    },

  },

  watch: {
    type(neu, old) {
      if (neu !== old) {
        this.setWorkloadFieldIfNotEmpty('data', undefined);
      }
    }
  },
  created() {
    if (!this.value.spec?.workload) {
      this.initSpec();
    }
  },
  methods: {
    initSpec() {
      const newSecret = {
        apiVersion: this.secretApiVersion,
        kind:       'Secret',
        metadata:   { namespace: this.value.metadata.namespace },
      };

      this.setField('spec', newSecret );
    },

    typeDisplay(type, driver) {
      const fallback = type.replace(/^kubernetes.io\//, '');

      return this.$store.getters['i18n/withFallback'](`secret.types."${ type }"`, null, fallback);
    },
  },
};
</script>

<template>
  <form class="filled-height">
    <div class="spacer"></div>

    <LabeledSelect
      v-model="type"
      :options="secretOptions"
      :label="t('verrazzano.common.fields.workloadSecretType')"
      :placeholder="getNotSetPlaceholder(value,'spec.workload.type')"
      :required="true"
    />

    <TreeTabbed>
      <template #nestedTabs>
        <TreeTab name="data" :label="dataLabel">
          <template #default>
            <div class="row">
              <div class="col span-6">
                <LabeledInput
                  :value="getWorkloadField('metadata.name')"
                  :mode="mode"
                  required
                  :placeholder="getWorkloadMetadataNotSetPlaceholder('name')"
                  :label="t('verrazzano.common.fields.workloadSecretName')"
                  @input="setWorkloadMetadataFieldIfNotEmpty('name', $event)"
                />
              </div>
            </div>
            <div class="spacer-small" />
            <component
              :is="dataComponent"
              v-if="typeKey"
              :value="value"
              :mode="mode"
              :hide-sensitive-data="hideSensitiveData"
            />
          </template>
        </TreeTab>
        <LabelsTab
          :value="getWorkloadField('metadata')"
          :mode="mode"
          tab-name="labels"
          @input="setWorkloadFieldIfNotEmpty('metadata', $event)"
        />
        <template>
        </template>
      </template>
    </TreeTabbed>
  </form>
</template>

<style lang='scss'>
</style>
