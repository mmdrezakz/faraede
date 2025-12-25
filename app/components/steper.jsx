'use client';
import * as React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const steps = [
  'توسعه پایگاه داده',
  'طراحی و تجربه رابط کاربری مدرن (UI, UX)',
  'مدیریت و امنیت هاست و دامنه و کاربران سایت',
];

const theme = createTheme({
  typography: {
    fontFamily: 'Lalezar, Arial, sans-serif'
  },
  palette: {
    primary: {
      main: '#ff5722',
      contrastText: '#fff',
    },
    secondary: {
      main: '#4caf50',
      contrastText: '#fff',
    },
  },
});

export default function ResponsiveStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const isMobile = useMediaQuery('(max-width:600px)');

  const isStepOptional = (step) => step === 1;
  const isStepSkipped = (step) => skipped.has(step);

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prev) => prev + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("Can't skip a non-optional step.");
    }
    setSkipped((prev) => {
      const newSkipped = new Set(prev);
      newSkipped.add(activeStep);
      return newSkipped;
    });
    setActiveStep((prev) => prev + 1);
  };

  const handleReset = () => setActiveStep(0);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
        
          maxWidth: '100%',
          px: { xs: 2, sm: 4 },
          py: { xs: 3, sm: 5 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Stepper
          activeStep={activeStep}
          orientation={isMobile ? 'vertical' : 'horizontal'}
          sx={{ width: '100%', mb: 3 }}
        >
          {steps.map((label, index) => {
            const stepProps = {};
            if (isStepSkipped(index)) stepProps.completed = false;
            return (
              <Step  key={label} {...stepProps}>
                <StepLabel ><p className='text-sm sm:text-lg lg:text-xl'>{label}</p></StepLabel>
              </Step>
            );
          })}
        </Stepper>

        {activeStep === steps.length ? (
          <>
            <Typography sx={{ mb: 2, textAlign: 'center' }}>
              تبریک! سایت شما آماده است و پشتیبانی با ماست.
            </Typography>
            <Button variant="contained" onClick={handleReset}>
              ریست
            </Button>
          </>
        ) : (
          <>
            <Typography sx={{ mb: 2, fontSize:"30px", }}>مرحله {activeStep + 1}</Typography>
            <Typography
              sx={{ fontSize:"30px",
                mb: 3,
                textAlign: 'justify',
                fontSize: { xs: '0.9rem', sm: '1rem' ,md:"1.4rem"},
              }}
            >
              {activeStep === 0 &&
                'یک پایگاه داده‌ی اصولی و مرتب باعث امنیت و کارایی بهتر سایت میشه.'}
              {activeStep === 1 &&
                'طراحان ما مدرن‌ترین رابط کاربری رو متناسب با نیاز شما طراحی می‌کنن.'}
              {activeStep === 2 &&
                'امنیت سایت یکی از چالش‌های مهمه که با خیال راحت به ما بسپارید.'}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1,
                width: '100%',
              }}
            >
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                قبلی
              </Button>

              {isStepOptional(activeStep) && (
                <Button color="inherit" onClick={handleSkip}>
                  رد کردن
                </Button>
              )}

              <Button variant="contained" onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'پایان' : 'بعدی'}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </ThemeProvider>
  );
}