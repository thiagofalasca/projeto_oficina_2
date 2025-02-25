import { test, expect } from '@playwright/test';
import { getSessionTokenForTest } from '@/tests-e2e/utils/auth';
import { ROLES, workshopStatus } from '@/lib/constants';

test.describe('Usuário não autenticado', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('Redireciona para página correta após login bem sucedido', async ({
    page,
  }) => {
    await page.goto('/auth/sign-in');
    await expect(page.getByRole('heading', { name: /entrar/i })).toBeVisible();

    await page.getByRole('textbox', { name: /email/i }).fill('user@user.com');
    await page.getByRole('textbox', { name: /senha/i }).fill('123456');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForURL('/workshops');

    expect(page.url()).toBe('http://localhost:3000/workshops');
    await expect(
      page.getByRole('heading', {
        name: /^bem-vindo/i,
      })
    ).toBeVisible();
  });

  test('Mostra mensagem de erro ao tentar login com credenciais inválidas', async ({
    page,
  }) => {
    await page.goto('/auth/sign-in');
    await expect(page.getByRole('heading', { name: /entrar/i })).toBeVisible();

    await page.getByRole('textbox', { name: /email/i }).fill('user@user.com');
    await page.getByRole('textbox', { name: /senha/i }).fill('wrongpassword');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForTimeout(30000);
    await expect(page.getByText(/credenciais inválidas/i)).toBeVisible();
  });

  test('Bloquei acesso a rota protegica para usuário não autenticado', async ({
    page,
  }) => {
    await page.goto('/workshops');
    await page.waitForURL('/auth/sign-in');
    await expect(page.getByRole('heading', { name: /entrar/i })).toBeVisible();
  });

  test('Pode acessar a pagina de Cadastro', async ({ page }) => {
    await page.goto('/auth/sign-up');
    await expect(
      page.getByRole('heading', { name: /criar conta/i })
    ).toBeVisible();
  });
});

test.describe('Usuário Autenticado', () => {
  test('Pode realizar logout', async ({ page }) => {
    await page.goto('/workshops');
    await expect(
      page.getByRole('heading', {
        name: /^bem-vindo/i,
      })
    ).toBeVisible();

    await page.getByTestId('sign-out-button').click();
    await page.waitForURL('/auth/sign-in');
    await expect(page.getByRole('heading', { name: /entrar/i })).toBeVisible();
  });

  test('Bloqueia acesso a rota protegica para usuário sem premissão', async ({
    page,
  }) => {
    await page.goto('/workshops/create');
    await page.waitForURL('/workshops');
    await expect(
      page.getByRole('heading', {
        name: /^bem-vindo/i,
      })
    ).toBeVisible();
  });

  test('Retorna página 404 para workshop que não existe', async ({ page }) => {
    const response = await page.goto('/workshops/invalid-id');

    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: /^404/i })).toBeVisible();
  });

  test('Esconde elementos de edição, deleção e remover participante para usuário sem permissão', async ({
    page,
  }) => {
    await page.goto('/workshops/39ef71c6-f26b-4560-9241-1fb65482193f');

    await expect(page.getByText(/editar/i)).not.toBeVisible();
    await expect(
      page.getByRole('button', { name: /deletar/i })
    ).not.toBeVisible();
    await expect(page.getByTestId('remove-student-button')).not.toBeVisible();
  });
});

test.describe('Administrador autenticado', () => {
  test.beforeEach(async ({ context }) => {
    const updatedPayload = {
      sub: '49c80d54-0c92-4c40-b233-e2e104459b8a',
      role: ROLES[1],
    };

    await context.addCookies([
      {
        name: 'authjs.session-token',
        value: await getSessionTokenForTest(updatedPayload),
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        expires: Math.round((Date.now() + 86400000 * 1) / 1000),
      },
    ]);
  });

  test('Lança erro de validação ao tentar criar workshop com dados inválidos', async ({
    page,
  }) => {
    await page.goto('/workshops');
    await expect(page.getByText(/criar workshop/i)).toBeVisible();
    await page.getByText(/criar workshop/i).click();
    await page.waitForURL('/workshops/create');

    const validWorkshop = {
      title: 'Workshop de Teste',
      description: 'Descrição do Workshop de Teste',
      startDate: '10/10/2024',
      endDate: '15/10/2024',
      status: workshopStatus[1],
      key: 'invalid-key',
    };

    await page
      .getByRole('textbox', { name: /título/i })
      .fill(validWorkshop.title);
    await page
      .getByRole('textbox', { name: /descrição/i })
      .fill(validWorkshop.description);
    await page
      .getByRole('textbox', { name: /data de início/i })
      .fill(validWorkshop.startDate);
    await page
      .getByRole('textbox', { name: /data de término/i })
      .fill(validWorkshop.endDate);

    await page.getByLabel(/status/i).click();
    await page.getByRole('option', { name: validWorkshop.status }).click();

    await page.getByRole('textbox', { name: /chave/i }).fill(validWorkshop.key);
    await page.getByRole('button', { name: /cadastrar workshop/i }).click();

    await expect(
      page.getByText(/chave pode conter no máximo 10 caracteres./i)
    ).toBeVisible();
  });

  test.describe.serial('Operações de Workshop', () => {
    test('Administrador pode criar um workshop', async ({ page }) => {
      await page.goto('/workshops');
      await expect(page.getByText(/criar workshop/i)).toBeVisible();
      await page.getByText(/criar workshop/i).click();
      await page.waitForURL('/workshops/create');

      const validWorkshop = {
        title: 'Workshop de Teste',
        description: 'Descrição do Workshop de Teste',
        startDate: '10/10/2024',
        endDate: '15/10/2024',
        status: workshopStatus[1],
        key: '12345',
      };

      await page
        .getByRole('textbox', { name: /título/i })
        .fill(validWorkshop.title);
      await page
        .getByRole('textbox', { name: /descrição/i })
        .fill(validWorkshop.description);
      await page
        .getByRole('textbox', { name: /data de início/i })
        .fill(validWorkshop.startDate);
      await page
        .getByRole('textbox', { name: /data de término/i })
        .fill(validWorkshop.endDate);

      await page.getByLabel(/status/i).click();
      await page.getByRole('option', { name: validWorkshop.status }).click();

      await page
        .getByRole('textbox', { name: /chave/i })
        .fill(validWorkshop.key);
      await page.getByRole('button', { name: /cadastrar workshop/i }).click();

      await page.waitForURL('/workshops?created=true');
      await expect(page.getByText(validWorkshop.title)).toBeVisible();
      await expect(
        page.getByText('Workshop criado com sucesso!').first()
      ).toBeVisible();
    });

    test('Administrador pode deletar um workshop', async ({ page }) => {
      await page.goto('/workshops');
      await page.getByText('Workshop de Teste').click();
      await expect(
        page.getByRole('heading', { name: /workshop de teste/i })
      ).toBeVisible();

      await page.getByRole('button', { name: /deletar/i }).click();
      await expect(page.getByText(/você tem certeza/i)).toBeVisible();
      await page.getByRole('button', { name: /deletar/i }).click();
      await page.waitForURL('/workshops?deleted=true');
      await expect(
        page.getByText('Workshop deletado com sucesso!').first()
      ).toBeVisible();
    });
  });
});
