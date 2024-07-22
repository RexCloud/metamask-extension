import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  ButtonPrimary,
  ButtonPrimarySize,
  FormTextField,
  HelpText,
  HelpTextSeverity,
} from '../../../component-library';
import {
  BlockSize,
  Display,
  TextVariant,
} from '../../../../helpers/constants/design-system';
import { useI18nContext } from '../../../../hooks/useI18nContext';
import { isWebUrl } from '../../../../../app/scripts/lib/util';

const AddRpcUrlModal = ({
  onAdded,
}: {
  onAdded: (url: string, name?: string) => void;
}) => {
  const t = useI18nContext();

  const [url, setUrl] = useState<string>();
  const [error, setError] = useState<string>();
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log(url);
    if (url?.length > 0 && !isWebUrl(url)) {
      setError(isWebUrl(`https://${url}`) ? t('urlErrorMsg') : t('invalidRPC'));
    } else {
      setError(undefined);
    }
  }, [url]);

  return (
    <Box paddingTop={4} paddingLeft={4} paddingRight={4}>
      <FormTextField
        error={Boolean(error)}
        label={t('rpcUrl')}
        placeholder={t('enterRpcUrl')}
        inputProps={{ variant: TextVariant.bodySm }}
        labelProps={{
          children: undefined,
          variant: TextVariant.bodySmMedium,
        }}
        onChange={(e) => setUrl(e.target.value)}
      />
      {error && <HelpText severity={HelpTextSeverity.Danger}>{error}</HelpText>}
      <FormTextField
        inputProps={{
          variant: TextVariant.bodySm,
        }}
        placeholder={t('enterANameToIdentifyTheUrl')}
        paddingTop={4}
        inputRef={nameRef}
        label={t('rpcNameOptional')}
        labelProps={{
          children: undefined,
          variant: TextVariant.bodySmMedium,
        }}
      />

      <ButtonPrimary
        disabled={Boolean(error)}
        size={ButtonPrimarySize.Lg}
        display={Display.Block}
        width={BlockSize.Full}
        marginTop={8}
        marginLeft={'auto'}
        marginRight={'auto'}
        onClick={async () => {
          if (url && !error && nameRef.current) {
            onAdded(url, nameRef.current.value || undefined);
          }
        }}
      >
        {t('addUrl')}
      </ButtonPrimary>
    </Box>
  );
};

export default AddRpcUrlModal;
