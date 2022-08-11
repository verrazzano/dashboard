<script>
// Added by Verrazzano
import CruResource from '@/components/CruResource';
import IngressTraitsTab from '@/edit/core.oam.dev.applicationconfiguration/IngressTraitsTab';
import KeyValue from '@/components/form/KeyValue';
import LabeledSelect from '@/components/form/LabeledSelect';
import LabeledInput from '@/components/form/LabeledInput';
import Loading from '@/components/Loading';
import LoggingTraitTab from '@/edit/core.oam.dev.applicationconfiguration/LoggingTraitTab';
import ManualScalerTraitTab from '@/edit/core.oam.dev.applicationconfiguration/ManualScalerTraitTab';
import MetricsTraitTab from '@/edit/core.oam.dev.applicationconfiguration/MetricsTraitTab';
import NameNsDescription from '@/components/form/NameNsDescription';
import TabDeleteButton from '@/components/verrazzano/TabDeleteButton';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import TreeTabbed from '@/components/verrazzano/TreeTabbed';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

import { VZ_COMPONENT } from '@/config/types';
import { allHash } from '@/utils/promise';
import { randomStr } from '@/utils/string';
import debounce from 'lodash/debounce';

export default {
  name:       'VzApplication',
  components: {
    CruResource,
    IngressTraitsTab,
    KeyValue,
    LabeledInput,
    LabeledSelect,
    Loading,
    LoggingTraitTab,
    ManualScalerTraitTab,
    MetricsTraitTab,
    NameNsDescription,
    TabDeleteButton,
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
    const components = (this.value.spec?.components || []).map((component) => {
      const newComponent = this.clone(component);

      newComponent._id = randomStr(4);

      return newComponent;
    });

    return {
      fetchInProgress:      true,
      namespace:            this.value.metadata?.namespace,
      allComponents:        {},
      namespacedComponents: [],
      newName:              '',
      newTraitType:         '',
      components,
    };
  },
  async fetch() {
    const requests = {};

    if ( this.$store.getters['cluster/schemaFor'](VZ_COMPONENT)) {
      requests.components = this.$store.dispatch('cluster/findAll', { type: VZ_COMPONENT });
    }

    const hash = await allHash(requests);

    if (hash.components) {
      this.sortObjectsByNamespace(hash.components, this.allComponents);
    }
    this.fetchInProgress = false;
  },
  computed: {
    traitTypeOptions() {
      return [
        { value: 'IngressTrait', label: this.t('verrazzano.common.types.trait.ingress') },
        { value: 'LoggingTrait', label: this.t('verrazzano.common.types.trait.logging') },
        { value: 'ManualScalerTrait', label: this.t('verrazzano.common.types.trait.manualScaler') },
        { value: 'MetricsTrait', label: this.t('verrazzano.common.types.trait.metrics') },
      ];
    },
    availableComponents() {
      const usedComponentNames = this.components.map(component => component.componentName);

      return this.namespacedComponents.filter(component => !usedComponentNames.includes(component.metadata.name));
    },
  },
  methods: {
    update() {
      const components = [];

      this.components.forEach((component) => {
        const newComponent = this.clone(component);

        delete newComponent._id;
        components.push(newComponent);
      });

      this.setFieldIfNotEmpty('spec.components', components);
    },
    resetComponents() {
      this.namespacedComponents = this.allComponents[this.namespace] || [];
    },
    addComponent() {
      if (this.newName) {
        this.components.push({
          _id:           randomStr(4),
          componentName: this.newName,
          traits:        [],
        });
        this.newName = '';

        this.queueUpdate();
      }
    },
    deleteComponent(componentToDelete) {
      const index = this.components.findIndex(component => component._id === componentToDelete._id);

      if (index !== -1) {
        this.components.splice(index, 1);
        this.queueUpdate();
      }
    },
    componentKey(component) {
      return this.createTabName('component', component.componentName);
    },
    getAvailableTraitTypes(component) {
      const usedTraitTypes = component.traits.map(trait => trait.trait.kind);

      return this.traitTypeOptions.filter(traitType => !usedTraitTypes.includes(traitType.value));
    },
    getTraitApiVersion(traitType) {
      let apiVersion;

      switch (traitType) {
      case 'IngressTrait':
        apiVersion = this.ingressTraitApiVersion;
        break;

      case 'LoggingTrait':
        apiVersion = this.loggingTraitApiVersion;
        break;

      case 'ManualScalerTrait':
        apiVersion = this.manualScalerTraitApiVersion;
        break;

      case 'MetricsTrait':
        apiVersion = this.metricsTraitApiVersion;
        break;
      }

      return apiVersion;
    },
    addTrait(component) {
      if (this.newTraitType) {
        if (!component.traits) {
          component.traits = [];
        }
        component.traits.push({
          trait: {
            apiVersion: this.getTraitApiVersion(this.newTraitType),
            kind:       this.newTraitType,
            spec:       { },
          }
        });
        this.newTraitType = '';
        this.queueUpdate();
      }
    },
    getIngressTrait(component) {
      return (component.traits || []).find(t => t.trait.kind === 'IngressTrait');
    },
    getLoggingTrait(component) {
      return (component.traits || []).find(t => t.trait.kind === 'LoggingTrait');
    },
    getManualScalerTrait(component) {
      return (component.traits || []).find(t => t.trait.kind === 'ManualScalerTrait');
    },
    getMetricsTrait(component) {
      return (component.traits || []).find(t => t.trait.kind === 'MetricsTrait');
    },
    removeTrait(component, traitType) {
      const index = (component.traits || []).findIndex(t => t.trait.kind === traitType);

      if (index !== -1) {
        component.traits.splice(index, 1);
        this.queueUpdate();
      }
    }
  },
  created() {
    this.queueUpdate = debounce(this.update, 500);
  },
  watch: {
    fetchInProgress() {
      this.resetComponents();
    },
    'value.metadata.namespace'(neu, old) {
      this.namespace = neu;
      this.resetComponents();
    }
  },
};
</script>

<template>
  <Loading v-if="$fetchState.pending" />
  <form v-else>
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
          <TreeTab
            :label="t('verrazzano.common.tabs.metadata')"
            name="metadata"
          >
            <template #default>
              <div class="row">
                <div class="col span-4">
                  <LabeledInput
                    :value="getField('metadata.annotations.version')"
                    :mode="mode"
                    :placeholder="getNotSetPlaceholder(value, 'metadata.annotations.version')"
                    :label="t('verrazzano.common.fields.version')"
                    @input="setFieldIfNotEmpty('metadata.annotations.version', $event)"
                  />
                </div>
              </div>
              <div class="spacer" />
              <div>
                <KeyValue
                  :value="getField('metadata.labels')"
                  :mode="mode"
                  :read-allowed="false"
                  :title="t('verrazzano.common.titles.labels')"
                  :add-label="t('verrazzano.common.buttons.addLabel')"
                  @input="setFieldIfNotEmpty('metadata.labels', $event)"
                />
              </div>
            </template>
          </TreeTab>
          <TreeTab
            :label="t('verrazzano.common.tabs.components')"
            name="components"
            :show-nav-children="true"
          >
            <template #default>
              <div v-if="!isView" class="row">
                <div class="col span-4">
                  <LabeledSelect
                    v-model="newName"
                    :mode="mode"
                    :options="availableComponents"
                    option-label="metadata.name"
                    :reduce="component => component.metadata.name"
                    :label="t('verrazzano.common.fields.newComponentName')"
                  />
                </div>
                <div class="col span-4">
                  <button
                    type="button"
                    class="btn role-tertiary add"
                    data-testid="add-item"
                    :disabled="isView"
                    @click="addComponent()"
                  >
                    {{ t('verrazzano.common.buttons.addComponent') }}
                  </button>
                </div>
              </div>
            </template>
            <template #nestedTabs>
              <TreeTab
                v-for="component in components"
                :key="componentKey(component)"
                :label="component.componentName"
                :title="t('verrazzano.common.titles.component')"
                :name="componentKey(component)"
              >
                <template #beside-header>
                  <TabDeleteButton
                    :element-name="t('verrazzano.common.titles.component')"
                    :button-label="t('verrazzano.common.messages.removeComponentFromApplication')"
                    :mode="mode"
                    @click="deleteComponent(component)"
                  />
                </template>
                <template #default>
                  <div>
                    <div class="row">
                      <div class="col span-6">
                        <LabeledInput
                          :value="component.componentName"
                          :mode="mode"
                          disabled
                          :label="t('verrazzano.common.fields.componentName')"
                        />
                      </div>
                    </div>
                    <div v-if="!isView">
                      <div class="spacer-small" />
                      <div class="row">
                        <div class="col span-6">
                          <LabeledSelect
                            v-model="newTraitType"
                            :mode="mode"
                            :options="getAvailableTraitTypes(component)"
                            option-key="value"
                            option-label="label"
                            :label="t('verrazzano.common.fields.newTraitType')"
                          />
                        </div>
                        <div class="col span-6">
                          <button
                            type="button"
                            class="btn role-tertiary add"
                            data-testid="add-item"
                            @click="addTrait(component)"
                          >
                            {{ t('verrazzano.common.buttons.addTrait') }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <template #nestedTabs>
                  <IngressTraitsTab
                    v-if="getIngressTrait(component)"
                    :value="getIngressTrait(component)"
                    :mode="mode"
                    :namespaced-object="value"
                    :tab-name="createTabName(componentKey(component), 'ingressTrait')"
                    @deleteTrait="removeTrait(component, $event)"
                    @input="queueUpdate"
                  />
                  <LoggingTraitTab
                    v-if="getLoggingTrait(component)"
                    :value="getLoggingTrait(component)"
                    :mode="mode"
                    :tab-name="createTabName(componentKey(component), 'loggingTrait')"
                    @deleteTrait="removeTrait(component, $event)"
                    @input="queueUpdate"
                  />
                  <ManualScalerTraitTab
                    v-if="getManualScalerTrait(component)"
                    :value="getManualScalerTrait(component)"
                    :mode="mode"
                    :tab-name="createTabName(componentKey(component), 'manualScalerTrait')"
                    @deleteTrait="removeTrait(component, $event)"
                    @input="queueUpdate"
                  />
                  <MetricsTraitTab
                    v-if="getMetricsTrait(component)"
                    :value="getMetricsTrait(component)"
                    :mode="mode"
                    :namespaced-object="value"
                    :tab-name="createTabName(componentKey(component), 'metricsTrait')"
                    @deleteTrait="removeTrait(component, $event)"
                    @input="queueUpdate"
                  />
                </template>
              </TreeTab>
            </template>
          </TreeTab>
        </template>
      </TreeTabbed>
    </CruResource>
  </form>
</template>

<style lang='scss'>
.container-row{
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.type-placeholder{
  color: white;
    font-size: 2.5em;
    height: 100%;
    width: 100%;
    background-color: var(--primary);
    display: flex;
    justify-content: center;
    align-items: center;
}

.type-description{
  color: var(--input-label)
}

.next-dropdown{
  display: inline-block;
}
</style>
