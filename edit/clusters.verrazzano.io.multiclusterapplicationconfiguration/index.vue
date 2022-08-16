<script>
// Added by Verrazzano
import ApplicationComponentsTab from '@/components/verrazzano/ApplicationComponentsTab';
import CruResource from '@/components/CruResource';
import KeyValue from '@/components/form/KeyValue';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import Loading from '@/components/Loading';
import NameNsDescription from '@/components/form/NameNsDescription';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import TreeTabbed from '@/components/verrazzano/TreeTabbed';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';
import { CAPI, SECRET } from '@/config/types';
import { allHash } from '@/utils/promise';

export default {
  name:       'VzMultiClusterApplication',
  components: {
    ApplicationComponentsTab,
    CruResource,
    KeyValue,
    LabeledInput,
    LabeledSelect,
    Loading,
    NameNsDescription,
    TreeTab,
    TreeTabbed,
  },
  mixins: [VerrazzanoHelper],
  props:  {
    value: {
      type:     Object,
      required: true,
    },
    mode: {
      type:    String,
      default: 'create'
    },
  },
  data() {
    const clusterNames = this.getListField('spec.placement.clusters').map(cluster => cluster.name);

    return {
      fetchInProgress: true,
      namespace:       this.value.metadata.namespace,
      allSecrets:      {},
      secrets:         [],
      clusters:        [],
      clusterNames,
    };
  },
  async fetch() {
    const requests = { clusters: this.$store.dispatch('management/findAll', { type: CAPI.RANCHER_CLUSTER }) };

    if (this.$store.getters['cluster/schemaFor'](SECRET)) {
      requests.secrets = this.$store.dispatch('cluster/findAll', { type: SECRET });
    }

    const hash = await allHash(requests);

    if (hash.clusters) {
      this.clusters = hash.clusters;
    }
    if (hash.secrets) {
      this.sortObjectsByNamespace(hash.secrets, this.allSecrets);
    }
    this.fetchInProgress = false;
  },
  methods: {
    resetSecrets() {
      this.secrets = this.allSecrets[this.namespace] || [];
    },
    setPlacementClusters(value) {
      if (Array.isArray(value) && value.length > 0) {
        const clustersToSet = value.map((clusterName) => {
          return { name: clusterName };
        });

        this.setFieldIfNotEmpty('spec.placement.clusters', clustersToSet);
      } else {
        this.setField('spec.placement.clusters', undefined);
      }
    }
  },
  watch: {
    fetchInProgress() {
      this.resetSecrets();
    },
    'value.metadata.namespace'(neu, old) {
      this.namespace = neu;
      this.resetSecrets();
    }
  },
};
</script>

<template>
  <Loading v-if="$fetchState.pending" />
  <form v-else class="tree-tabbed-form">
    <CruResource
      :validation-passed="true"
      :resource="value"
      :mode="mode"
      :errors="errors"
      :done-route="doneRoute"
      :apply-hooks="applyHooks"
      @finish="save"
      @error="e=>errors = e"
    >
      <div class="row">
        <div class="col span-12">
          <NameNsDescription
            :value="value"
            :extra-columns="[]"
            :mode="mode"
            description-key="metadata.annotations.description"
            @change="name=value.metadata.name"
          />
        </div>
      </div>
      <TreeTabbed>
        <template #nestedTabs>
          <TreeTab name="metadata" :label="t('verrazzano.common.tabs.metadata')">
            <template #default>
              <div class="row">
                <div class="col span-4">
                  <LabeledInput
                    :value="getTemplateMetadataField('annotations.version')"
                    :mode="mode"
                    :placeholder="getTemplateMetadataNotSetPlaceholder( 'annotations.version')"
                    :label="t('verrazzano.common.fields.version')"
                    @input="setTemplateMetadataFieldIfNotEmpty('annotations.version', $event)"
                  />
                </div>
              </div>
              <div class="spacer" />
              <div>
                <KeyValue
                  :value="getTemplateMetadataField('labels')"
                  :mode="mode"
                  :read-allowed="false"
                  :title="t('verrazzano.common.titles.labels')"
                  :add-label="t('verrazzano.common.buttons.addLabel')"
                  @input="setTemplateMetadataFieldIfNotEmpty('labels', $event)"
                />
              </div>
            </template>
          </TreeTab>
          <TreeTab name="general" :label="t('verrazzano.common.tabs.general')">
            <template #default>
              <div class="row">
                <div class="col span-6">
                  <LabeledSelect
                    :value="clusterNames"
                    :mode="mode"
                    :multiple="true"
                    :options="clusters"
                    option-label="metadata.name"
                    :reduce="cluster => cluster.metadata.name"
                    :placeholder="getNotSetPlaceholder(value, 'clusterNames')"
                    :label="t('verrazzano.common.fields.placement')"
                    @input="setPlacementClusters($event)"
                  />
                </div>
                <div class="col span-6">
                  <LabeledSelect
                    :value="getListField('spec.secrets')"
                    :mode="mode"
                    :multiple="true"
                    :options="secrets"
                    option-label="metadata.name"
                    :reduce="secret => secret.metadata.name"
                    :placeholder="getNotSetPlaceholder(value, 'spec.secrets')"
                    :label="t('verrazzano.common.fields.secrets')"
                    @input="setFieldIfNotEmpty('spec.secrets', $event)"
                  />
                </div>
              </div>
            </template>
          </TreeTab>
          <ApplicationComponentsTab
            :value="getTemplateSpecListField('components')"
            :mode="mode"
            :namespaced-object="value"
            tab-name="components"
            @input="setTemplateSpecFieldIfNotEmpty('components', $event)"
          />
        </template>
      </TreeTabbed>
    </CruResource>
  </form>
</template>

<style scoped>

</style>
