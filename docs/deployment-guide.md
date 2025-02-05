# Vercel Deployment & Domain Transfer Guide

## 1. Deploy to Vercel

### Step 1: Deploy Your Application
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your repository
4. Configure the project:
   - Framework Preset: `Vite`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist/public`

### Step 2: Set Environment Variables
Add these environment variables in your Vercel project settings:

```bash
# Database (Copy from Replit Secrets)
DATABASE_URL=<your-database-url>

# Stripe (Required for payments)
STRIPE_SECRET_KEY=<your-stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>

# Email Service
EMAIL_USER=<your-email>
EMAIL_PASSWORD=<your-email-password>
APP_URL=https://www.nxuacademy.co.uk
```

## 2. Domain Configuration

### Step 1: Add Domain in Vercel
1. Go to your project settings in Vercel
2. Navigate to "Domains" section
3. Click "Add Domain"
4. Enter your domain: `www.nxuacademy.co.uk`
5. Follow Vercel's domain configuration wizard

### Step 2: DNS Records
Add these DNS records at your domain registrar:
```
# Root domain (nxuacademy.co.uk)
Type: A
Name: @
Value: 76.76.21.21

# WWW subdomain
Type: CNAME
Name: www
Value: cname.vercel-dns.com.
```

### Step 3: SSL and Domain Verification
1. Wait for DNS propagation (can take up to 48 hours)
2. Verify SSL certificate is active
3. Test both domains:
   - https://www.nxuacademy.co.uk
   - https://nxuacademy.co.uk

### Step 4: Domain Redirection
Set up redirects in Vercel:
1. Go to project settings
2. Under "Domains", find your domains
3. Configure redirect from apex (nxuacademy.co.uk) to www (www.nxuacademy.co.uk)

## 3. Verification Steps

### Domain Setup Verification
```bash
# Check DNS propagation
dig www.nxuacademy.co.uk
dig nxuacademy.co.uk

# Verify SSL certificate
curl -vI https://www.nxuacademy.co.uk
```

### Application Testing
Visit these URLs to verify functionality:
1. Homepage: https://www.nxuacademy.co.uk/
2. API Test: https://www.nxuacademy.co.uk/deployment-test
3. Enrollment: https://www.nxuacademy.co.uk/admissions

## 4. Troubleshooting

### Common Issues
1. DNS Not Propagated
   - Wait 24-48 hours
   - Verify DNS records are correct
   - Use `dig` command to check propagation

2. SSL Certificate Issues
   - Ensure DNS is properly configured
   - Wait for Vercel to provision SSL
   - Check domain ownership verification

3. Application Errors
   - Verify environment variables
   - Check Vercel deployment logs
   - Test API endpoints

### Support Resources
- Vercel Documentation: https://vercel.com/docs
- Domain Registrar Support
- Vercel Support: https://vercel.com/support

## 5. Post-Deployment Checklist
- [ ] DNS records configured correctly
- [ ] SSL certificate active
- [ ] www redirect working
- [ ] All pages loading properly
- [ ] API endpoints responding
- [ ] Database connected
- [ ] Email service working
- [ ] Payment system functional

Need help? Contact support@nxuacademy.co.uk