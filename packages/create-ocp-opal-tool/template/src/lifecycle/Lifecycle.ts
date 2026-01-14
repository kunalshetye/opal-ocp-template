import {
  Lifecycle as BaseLifecycle,
  SubmittedFormData,
  LifecycleSettingsResult,
  AuthorizationGrantResult,
  Request,
  LifecycleResult,
  logger,
  storage
} from '@zaiusinc/app-sdk';

/**
 * Lifecycle hooks for the OCP Opal Tool.
 * These methods are called by OCP during app installation, upgrade, and uninstallation.
 */
export class Lifecycle extends BaseLifecycle {
  /**
   * Called when the app is installed to an OCP account.
   */
  public async onInstall(): Promise<LifecycleResult> {
    logger.info('Opal Tool: onInstall called');
    return { success: true };
  }

  /**
   * Handle a submission of a form section.
   */
  public async onSettingsForm(
    section: string,
    action: string,
    formData: SubmittedFormData
  ): Promise<LifecycleSettingsResult> {
    logger.info(`Opal Tool: onSettingsForm called for section ${section}, action ${action}`);

    // Save the form data to storage
    await storage.settings.put(section, formData);

    return new LifecycleSettingsResult();
  }

  /**
   * Called when the app is upgraded to a new version.
   */
  public async onUpgrade(fromVersion: string): Promise<LifecycleResult> {
    logger.info(`Opal Tool: onUpgrade called from version ${fromVersion}`);
    return { success: true };
  }

  /**
   * Called after upgrade is complete.
   */
  public async onFinalizeUpgrade(fromVersion: string): Promise<LifecycleResult> {
    logger.info(`Opal Tool: onFinalizeUpgrade called from version ${fromVersion}`);
    return { success: true };
  }

  /**
   * Called when the app is uninstalled from an OCP account.
   */
  public async onUninstall(): Promise<LifecycleResult> {
    logger.info('Opal Tool: onUninstall called');
    return { success: true };
  }

  /**
   * Handles outbound OAuth requests.
   */
  public async onAuthorizationRequest(
    section: string,
    formData: SubmittedFormData
  ): Promise<LifecycleSettingsResult> {
    logger.info(`Opal Tool: onAuthorizationRequest called for section ${section}`);
    // This app doesn't use OAuth, so return an error
    return new LifecycleSettingsResult()
      .addError('oauth', 'OAuth is not supported by this app');
  }

  /**
   * Handles inbound OAuth grants.
   */
  public async onAuthorizationGrant(request: Request): Promise<AuthorizationGrantResult> {
    logger.info('Opal Tool: onAuthorizationGrant called');
    // This app doesn't use OAuth, so redirect back to settings with an error
    return new AuthorizationGrantResult('general')
      .addError('oauth', 'OAuth is not supported by this app');
  }
}
