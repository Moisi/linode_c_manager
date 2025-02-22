import * as React from 'react';
import ActionsPanel from 'src/components/ActionsPanel';
import Button from 'src/components/Button';
import Box from 'src/components/core/Box';
import { makeStyles, Theme } from 'src/components/core/styles';
import Typography from 'src/components/core/Typography';
import Drawer from 'src/components/Drawer';
import Notice from 'src/components/Notice';
import { addCountToTypes } from 'src/features/Kubernetes/CreateCluster/NodePoolPanel';
import SelectPlanQuantityPanel, {
  ExtendedTypeWithCount,
} from 'src/features/linodes/LinodesCreate/SelectPlanQuantityPanel';
import { useCreateNodePoolMutation } from 'src/queries/kubernetes';
import { useAllLinodeTypesQuery } from 'src/queries/linodes';
import { extendType } from 'src/store/linodeType/linodeType.reducer';
import { filterCurrentTypes } from 'src/utilities/filterCurrentLinodeTypes';
import { pluralize } from 'src/utilities/pluralize';
import scrollErrorIntoView from 'src/utilities/scrollErrorIntoView';
import { nodeWarning } from '../../kubeUtils';

const useStyles = makeStyles((theme: Theme) => ({
  drawer: {
    '& .MuiDrawer-paper': {
      [theme.breakpoints.up('md')]: {
        width: 790,
      },
      overflowX: 'hidden',
    },
    '& .MuiGrid-root': {
      marginBottom: 0,
    },
  },
  error: {
    marginBottom: '0 !important',
  },
  plans: {
    '& > *': {
      marginTop: 0,
      '& > *': {
        padding: 0,
      },
    },
  },
  button: {
    paddingTop: 0,
    marginTop: '0 !important',
  },
  priceDisplay: {
    color: theme.color.headline,
    display: 'inline',
    fontSize: '1rem',
    lineHeight: '1.25rem',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    '& span': {
      fontWeight: 'bold',
    },
  },
  boxOuter: {
    width: '100%',
    [theme.breakpoints.down('md')]: {
      alignItems: 'flex-start',
      flexDirection: 'column',
    },
  },
}));

export interface Props {
  clusterId: number;
  clusterLabel: string;
  open: boolean;
  onClose: () => void;
}

export const AddNodePoolDrawer = (props: Props) => {
  const { clusterId, clusterLabel, onClose, open } = props;
  const classes = useStyles();
  const { data: types } = useAllLinodeTypesQuery();
  const {
    mutateAsync: createPool,
    isLoading,
    error,
  } = useCreateNodePoolMutation(clusterId);

  // Only want to use current types here.
  const typesData = filterCurrentTypes(types?.map(extendType));

  const [selectedType, setSelectedType] = React.useState<string | undefined>(
    undefined
  );
  const [_types, setNewType] = React.useState<ExtendedTypeWithCount[]>(
    addCountToTypes(typesData || [])
  );

  const _selectedType = _types.find((thisType) => thisType.id === selectedType);
  const currentCount = _selectedType?.count ?? 0;
  const pricePerNode = _selectedType?.price?.monthly ?? 0;

  React.useEffect(() => {
    if (open) {
      resetDrawer();
    }
  }, [open]);

  React.useEffect(() => {
    if (error) {
      scrollErrorIntoView();
    }
  }, [error]);

  const resetDrawer = () => {
    const newTypes = _types.map((thisType) => {
      return {
        ...thisType,
        count: 0,
      };
    });
    setNewType(newTypes);
    setSelectedType(undefined);
  };

  const updatePlanCount = (planId: string, newCount: number) => {
    const newTypes = _types.map((thisType: any) => {
      if (thisType.id === planId) {
        return { ...thisType, count: newCount };
      }
      return { ...thisType, count: 0 };
    });
    setNewType(newTypes);
    // If everything's empty, we need to reset the selected type.
    if (newTypes.every((thisType) => thisType.count === 0)) {
      setSelectedType(undefined);
    } else {
      setSelectedType(planId);
    }
  };

  const handleAdd = () => {
    const type = _types.find((thisType) => thisType.id === selectedType);
    if (!type || !selectedType) {
      return;
    }
    return createPool({ type: type.id, count: type.count }).then(() => {
      onClose();
    });
  };

  return (
    <Drawer
      title={`Add a Node Pool: ${clusterLabel}`}
      className={classes.drawer}
      open={open}
      onClose={onClose}
    >
      {error && (
        <Notice className={classes.error} error text={error?.[0].reason} />
      )}
      <form className={classes.plans}>
        <SelectPlanQuantityPanel
          // No nanodes or GPUs in clusters
          types={_types.filter(
            (t) => t.class !== 'nanode' && t.class !== 'gpu'
          )}
          selectedID={selectedType}
          onSelect={(newType: string) => setSelectedType(newType)}
          updatePlanCount={updatePlanCount}
          addPool={handleAdd}
          isSubmitting={isLoading}
          resetValues={resetDrawer}
        />
        {currentCount > 0 && currentCount < 3 && (
          <Notice
            important
            warning
            text={nodeWarning}
            spacingTop={8}
            spacingBottom={16}
          />
        )}
        <ActionsPanel className={classes.button}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent={currentCount > 0 ? 'space-between' : 'flex-end'}
            className={classes.boxOuter}
          >
            {currentCount > 0 && (
              <Typography className={classes.priceDisplay}>
                This pool will add{' '}
                <strong>
                  ${currentCount * pricePerNode}/month (
                  {pluralize('node', 'nodes', currentCount)} at ${pricePerNode}
                  /month)
                </strong>{' '}
                to this cluster.
              </Typography>
            )}
            <Button
              buttonType="primary"
              onClick={() => handleAdd()}
              disabled={currentCount === 0}
              loading={isLoading}
            >
              Add pool
            </Button>
          </Box>
        </ActionsPanel>
      </form>
    </Drawer>
  );
};
