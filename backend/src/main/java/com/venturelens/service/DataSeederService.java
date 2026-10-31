package com.venturelens.service;

import com.venturelens.entity.*;
import com.venturelens.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataSeederService implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final StartupRepository startupRepository;
    private final InvestorRepository investorRepository;
    private final SavedStartupRepository savedStartupRepository;
    private final MeetingRequestRepository meetingRequestRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeederService(
        AdminRepository adminRepository,
        StartupRepository startupRepository,
        InvestorRepository investorRepository,
        SavedStartupRepository savedStartupRepository,
        MeetingRequestRepository meetingRequestRepository,
        PasswordEncoder passwordEncoder
    ) {
        this.adminRepository = adminRepository;
        this.startupRepository = startupRepository;
        this.investorRepository = investorRepository;
        this.savedStartupRepository = savedStartupRepository;
        this.meetingRequestRepository = meetingRequestRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedAdmin();
        seedInitialPlatformData();
        upgradeLegacyPasswords();
    }

    private void upgradeLegacyPasswords() {
        try {
            List<Startup> allStartups = startupRepository.findAll();
            for (Startup s : allStartups) {
                if (s.getPassword() != null && !s.getPassword().startsWith("$2a$") && !s.getPassword().startsWith("$2b$")) {
                    s.setPassword(passwordEncoder.encode(s.getPassword()));
                    startupRepository.save(s);
                }
            }
            List<Investor> allInvestors = investorRepository.findAll();
            for (Investor i : allInvestors) {
                if (i.getPassword() != null && !i.getPassword().startsWith("$2a$") && !i.getPassword().startsWith("$2b$")) {
                    i.setPassword(passwordEncoder.encode(i.getPassword()));
                    investorRepository.save(i);
                }
            }
        } catch (Exception e) {
            System.err.println("Notice: Could not upgrade some legacy passwords: " + e.getMessage());
        }
    }

    private void seedAdmin() {
        Admin admin = adminRepository.findByEmail("admin@venturelens.com").orElse(new Admin());
        admin.setName("Platform Administrator");
        admin.setEmail("admin@venturelens.com");
        admin.setPassword(passwordEncoder.encode("Admin@12345"));
        admin.setRole("ROLE_ADMIN");
        if (admin.getCreatedAt() == null) {
            admin.setCreatedAt(LocalDateTime.now().minusMonths(6));
        }
        adminRepository.save(admin);
        System.out.println(">>> Seeded Admin: admin@venturelens.com / Admin@12345");
    }

    private void seedInitialPlatformData() {
        if (startupRepository.count() > 0) {
            return; // Already populated
        }

        // 1. Seed Startups
        Startup s1 = createStartup("Elena Rostova", "founder.elena@nexusfin.io", "Pass@1234", "NexusPay", "FinTech", "Series A", 4500000.0, 1850000.0, 110000.0, LocalDateTime.now().minusMonths(4));
        Startup s2 = createStartup("Marcus Vance", "marcus@neuralmesh.ai", "Pass@1234", "NeuralMesh", "Artificial Intelligence", "Seed", 2000000.0, 480000.0, 52000.0, LocalDateTime.now().minusMonths(3));
        Startup s3 = createStartup("Dr. Sarah Chen", "schen@aegisbio.com", "Pass@1234", "Aegis BioTech", "HealthTech", "Series B", 12000000.0, 3200000.0, 240000.0, LocalDateTime.now().minusMonths(5));
        Startup s4 = createStartup("David Lindqvist", "david@solarisgrid.com", "Pass@1234", "Solaris Grid", "CleanTech", "Pre-Seed", 850000.0, 120000.0, 28000.0, LocalDateTime.now().minusMonths(2));
        Startup s5 = createStartup("Priya Sharma", "priya@vaultcloud.io", "Pass@1234", "VaultCloud Security", "Cybersecurity", "Series A", 6000000.0, 2400000.0, 160000.0, LocalDateTime.now().minusMonths(3));
        Startup s6 = createStartup("Julian Torres", "julian@hyperlogix.com", "Pass@1234", "HyperLogix", "Enterprise SaaS", "Seed", 1500000.0, 350000.0, 45000.0, LocalDateTime.now().minusMonths(1));

        startupRepository.saveAll(List.of(s1, s2, s3, s4, s5, s6));

        // 2. Seed Investors
        Investor i1 = createInvestor("Victoria Thorne", "victoria@apexhorizon.com", "Pass@1234", "Apex Horizon Capital", "FinTech", LocalDateTime.now().minusMonths(4));
        Investor i2 = createInvestor("Alexander Sterling", "sterling@quantumvc.com", "Pass@1234", "Quantum Venture Partners", "Artificial Intelligence", LocalDateTime.now().minusMonths(3));
        Investor i3 = createInvestor("Claire Fontaine", "fontaine@bluepeakcap.com", "Pass@1234", "BluePeak Capital", "HealthTech", LocalDateTime.now().minusMonths(2));
        Investor i4 = createInvestor("Rajiv Mehta", "mehta@solisgrowth.com", "Pass@1234", "Solis Growth Fund", "Enterprise SaaS", LocalDateTime.now().minusMonths(2));

        investorRepository.saveAll(List.of(i1, i2, i3, i4));

        // 3. Seed Saved Startups
        savedStartupRepository.save(new SavedStartup(i1, s1));
        savedStartupRepository.save(new SavedStartup(i1, s5));
        savedStartupRepository.save(new SavedStartup(i2, s2));
        savedStartupRepository.save(new SavedStartup(i2, s1));
        savedStartupRepository.save(new SavedStartup(i3, s3));

        // 4. Seed Meeting Requests
        MeetingRequest m1 = new MeetingRequest(i1, s1, "Impressive revenue growth in Q3. We would love to discuss leading your Series A round and exploring European market expansion.");
        m1.setStatus("ACCEPTED");
        m1.setCreatedAt(LocalDateTime.now().minusDays(14));

        MeetingRequest m2 = new MeetingRequest(i2, s2, "Hi Marcus, reviewed your NeuralMesh pitch deck. Your edge-inference latency benchmarks look very promising. Can we schedule a 30-min call?");
        m2.setStatus("PENDING");
        m2.setCreatedAt(LocalDateTime.now().minusDays(5));

        MeetingRequest m3 = new MeetingRequest(i3, s3, "We are actively deploying capital in oncology therapeutics. We'd like to dive into your Phase 2 clinical milestones.");
        m3.setStatus("PENDING");
        m3.setCreatedAt(LocalDateTime.now().minusDays(2));

        MeetingRequest m4 = new MeetingRequest(i4, s1, "We want to discuss strategic enterprise distribution partnerships alongside syndicate participation.");
        m4.setStatus("REJECTED");
        m4.setCreatedAt(LocalDateTime.now().minusDays(20));

        MeetingRequest m5 = new MeetingRequest(i2, s5, "VaultCloud aligns strongly with our cybersecurity thesis. Let's schedule a deep-dive product demonstration with our technical partners.");
        m5.setStatus("PENDING");
        m5.setCreatedAt(LocalDateTime.now().minusDays(1));

        meetingRequestRepository.saveAll(List.of(m1, m2, m3, m4, m5));

        System.out.println(">>> Seeded Initial Startups, Investors, and Meetings successfully!");
    }

    private Startup createStartup(String founder, String email, String pwd, String company, String cat, String stage, Double target, Double rev, Double exp, LocalDateTime created) {
        Startup s = new Startup(founder, email, passwordEncoder.encode(pwd), company, cat);
        s.setFundingStage(stage);
        s.setTargetMoney(target);
        s.setYearlyRevenue(rev);
        s.setMonthlyExpenses(exp);
        s.setIsActive(true);
        s.setCreatedAt(created);
        return s;
    }

    private Investor createInvestor(String name, String email, String pwd, String firm, String cat, LocalDateTime created) {
        Investor i = new Investor(name, email, passwordEncoder.encode(pwd), firm, cat);
        i.setIsActive(true);
        i.setCreatedAt(created);
        return i;
    }
}
