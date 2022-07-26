<script>
// Added by Verrazzano
import CruResource from '@/components/CruResource';
import LabeledSelect from '@/components/form/LabeledSelect';
import LabeledInput from '@/components/form/LabeledInput';
import Loading from '@/components/Loading';
import NameNsDescription from '@/components/form/NameNsDescription';
import Traits from '@/edit/core.oam.dev.applicationconfiguration/Traits';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import TreeTabbed from '@/components/verrazzano/TreeTabbed';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

import { MANAGEMENT, SECRET, VZ_COMPONENT } from '@/config/types';
import { allHash } from '@/utils/promise';
import { _VIEW } from '@/config/query-params';

export default {
  name:       'VzApplication',
  components: {
    CruResource,
    LabeledInput,
    LabeledSelect,
    Loading,
    NameNsDescription,
    TreeTab,
    TreeTabbed,
    Traits,
  },
  mixins: [VerrazzanoHelper],
  props:  {
    value: {
      type:     Object,
      default:  () => ({})
    },
    mode: {
      type:    String,
      default: 'create'
    }
  },
  data() {
    if (!this.value.spec) {
      this.value.spec = {};
    }

    const spec = this.value.spec;
    const app = this.value;
    const version = app.metadata?.annotations?.version || null;
    const components = spec.components || [];

    const placement = spec.placement?.clusters;
    const secrets = spec.secrets || [];

    return {
      app,
      allClusterNames:   [],
      allComponentNames: [],
      allComponents:     [],
      allSecrets:        [],
      components,
      newName:           undefined,
      placement,
      secrets,
      spec,
      version,
    };
  },
  // FIXME - components and secrets need to be in the same namespace as the app.
  async fetch() {
    const requests = {
      clusters: this.$store.dispatch('management/findAll', {
        type: MANAGEMENT.CLUSTER,
        opt:  { url: MANAGEMENT.CLUSTER }
      }),
    };

    if ( this.$store.getters['cluster/schemaFor'](VZ_COMPONENT)) {
      requests.components = this.$store.dispatch('cluster/findAll', { type: VZ_COMPONENT });
    }

    if ( this.$store.getters['cluster/schemaFor'](SECRET) ) {
      requests.secrets = this.$store.dispatch('cluster/findAll', { type: SECRET });
    }

    const hash = await allHash(requests);

    this.allComponents = hash.components || [];
    this.allComponentNames = this.allComponents.map(component => component.metadata.name);
    this.allClusterNames = hash.clusters.map(cluster => cluster.id);
    this.allSecrets = [];
    if (hash.secrets) {
      this.allSecrets = hash.secrets.map(secret => secret.id);
    }

    if (typeof this.placement === 'undefined') {
      // According to the verrazzano team, the management cluster is always called "local'.
      //
      this.isMultiClusterApp = false;
      this.placement = ['local'];
    } else {
      this.isMultiClusterApp = true;
    }
  },
  methods: {
    addComponent() {
      // TODO: use the component from the chooser, maybe some duplicate checking
      const unusedName = this.getNextName(this.spec['components'], 'componentName', 'new');
      const newName = this.newName ? this.newName : unusedName;

      this.addConfigNode(this.spec, 'components', { componentName: newName, traits: [] });
    },
    deleteComponent(component) {
      this.deleteConfigNode(this.spec, 'components', component);
    },
    componentKey(component) {
      return this.createTabKey('component', component.componentName);
    }
  },

  computed: {
    isView() {
      return this.mode === _VIEW;
    },
  },

  watch: {
    container(neu) {
      const containers = this.isInitContainer ? this.podTemplateSpec.initContainers : this.podTemplateSpec.containers;
      const existing = containers.filter(container => container.__active)[0];

      Object.assign(existing, neu);
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
            :label="t('verrazzano.apps.config.titles.general')"
            name="general"
          >
            <div>
              <div :style="{'align-items':'center'}" class="row mb-20">
                <div class="col span-6">
                  <LabeledInput v-model="version" :mode="mode" :label="t('verrazzano.apps.version')" />
                </div>
              </div>
              <div :style="{'align-items':'center'}" class="row mb-20">
                <div class="col span-6">
                  <LabeledSelect
                    v-model="placement"
                    :mode="mode"
                    :label="t('verrazzano.apps.placement')"
                    :options="allClusterNames"
                    :multiple="true"
                  />
                </div>
              </div>
              <div :style="{'align-items':'center'}" class="row mb-20">
                <div class="col span-6">
                  <LabeledSelect
                    v-model="secrets"
                    :mode="mode"
                    :label="t('verrazzano.apps.secrets')"
                    :options="allSecrets"
                    :multiple="true"
                  />
                </div>
              </div>
            </div>
          </TreeTab>
          <TreeTab
            :label="t('verrazzano.apps.config.titles.components')"
            name="components"
            :show-nav-children="true"
          >
            <LabeledInput
              v-model="newName"
              :mode="mode"
              label="New Component Name"
              placeholder="TODO: this should be a chooser from available components"
            />
            <br />
            <button
              type="button"
              class="btn role-tertiary add"
              data-testid="add-item"
              :disabled="isView"
              @click="addComponent()"
            >
              {{ t('verrazzano.apps.buttons.addComponent') }}
            </button>
            <template #nestedTabs>
              <TreeTab
                v-for="component in spec.components"
                :key="componentKey(component)"
                :label="component.componentName"
                :title="t('verrazzano.common.titles.component')"
                :name="componentKey(component)"
              >
                <div :style="{'align-items':'center'}" class="row mb-20">
                  <div class="col span-12">
                    <!-- <LabeledSelect v-model="allComponentNames" :mode="mode" :label="t('verrazzano.apps.component.name')" :options="allComponentNames" />-->
                    <LabeledInput v-model="component.componentName" :mode="mode" label="Component Name" />
                    <br />
                    <Traits v-model="component.traits" :mode="mode" />
                  </div>
                </div>
                <button
                  type="button"
                  class="btn role-tertiary add"
                  data-testid="add-item"
                  :disabled="isView"
                  @click="deleteComponent(component)"
                >
                  {{ t('verrazzano.apps.buttons.deleteComponent') }}
                </button>
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
